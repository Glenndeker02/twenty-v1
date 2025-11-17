import { Injectable, Logger } from '@nestjs/common';

import { ConnectedAccountProvider } from 'twenty-shared/types';

import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';
import {
  WhopApiClientService,
  type WhopMembership,
  type WhopProduct,
  type WhopUser,
} from 'src/modules/whop/services/whop-api-client.service';

export type WhopSyncResult = {
  success: boolean;
  productsSync: number;
  usersSync: number;
  membershipsSync: number;
  errors: string[];
};

@Injectable()
export class WhopSyncService {
  private readonly logger = new Logger(WhopSyncService.name);

  constructor(
    private readonly whopApiClient: WhopApiClientService,
    private readonly twentyORMManager: TwentyORMManager,
  ) {}

  /**
   * Perform a full sync of all Whop data for a workspace
   */
  async performFullSync(
    workspaceId: string,
    workspaceMemberId: string,
  ): Promise<WhopSyncResult> {
    const result: WhopSyncResult = {
      success: false,
      productsSync: 0,
      usersSync: 0,
      membershipsSync: 0,
      errors: [],
    };

    try {
      // Get the connected account
      const connectedAccountRepository =
        await this.twentyORMManager.getRepository<ConnectedAccountWorkspaceEntity>(
          'connectedAccount',
        );

      const connectedAccount = await connectedAccountRepository.findOne({
        where: {
          accountOwnerId: workspaceMemberId,
          provider: ConnectedAccountProvider.WHOP,
        },
      });

      if (!connectedAccount) {
        result.errors.push('Whop connected account not found');

        return result;
      }

      const accessToken = connectedAccount.accessToken;

      // Sync products
      this.logger.log(
        `Starting Whop products sync for workspace ${workspaceId}`,
      );
      const products = await this.whopApiClient.getAllProducts(accessToken);
      result.productsSync = products.length;
      this.logger.log(`Synced ${products.length} Whop products`);

      // Sync memberships (which include user data)
      this.logger.log(
        `Starting Whop memberships sync for workspace ${workspaceId}`,
      );
      const memberships =
        await this.whopApiClient.getAllMemberships(accessToken);

      // Extract unique users from memberships
      const uniqueUsers = this.extractUniqueUsers(memberships);
      result.usersSync = uniqueUsers.length;

      // Sync users to Person records
      await this.syncUsersToPersons(
        uniqueUsers,
        workspaceId,
        connectedAccount.id,
      );
      this.logger.log(`Synced ${uniqueUsers.length} Whop users to Persons`);

      // Sync memberships to Opportunity records
      await this.syncMembershipsToOpportunities(
        memberships,
        products,
        workspaceId,
        connectedAccount.id,
      );
      result.membershipsSync = memberships.length;
      this.logger.log(
        `Synced ${memberships.length} Whop memberships to Opportunities`,
      );

      result.success = true;

      return result;
    } catch (error) {
      this.logger.error('Failed to perform Whop full sync', error);
      result.errors.push(error.message);

      return result;
    }
  }

  /**
   * Sync individual membership (called from webhook)
   */
  async syncMembership(
    membershipId: string,
    workspaceId: string,
    accessToken: string,
  ): Promise<void> {
    try {
      const membership =
        await this.whopApiClient.getMembershipById(membershipId, accessToken);

      const personRepository =
        await this.twentyORMManager.getRepository<PersonWorkspaceEntity>(
          'person',
        );

      // Find or create person for this user
      let person = await personRepository.findOne({
        where: {
          // Note: In production, we'd search by a custom field 'whopUserId'
          // For now, we'll use email as the matching field
          emails: {
            primaryEmail: membership.user.email || '',
          },
        },
      });

      if (!person && membership.user.email) {
        person = personRepository.create({
          name: {
            firstName: membership.user.username || '',
            lastName: '',
          },
          emails: {
            primaryEmail: membership.user.email,
            additionalEmails: [],
          },
        });
        await personRepository.save(person);
      }

      // Create or update opportunity for this membership
      const opportunityRepository =
        await this.twentyORMManager.getRepository<OpportunityWorkspaceEntity>(
          'opportunity',
        );

      const opportunityName = `${membership.product.name} - ${membership.user.username}`;

      let opportunity = await opportunityRepository.findOne({
        where: {
          // Note: In production, we'd search by a custom field 'whopMembershipId'
          name: opportunityName,
        },
      });

      const stage = this.mapMembershipStatusToStage(membership);

      if (!opportunity) {
        opportunity = opportunityRepository.create({
          name: opportunityName,
          stage,
          pointOfContactId: person?.id || null,
        });
      } else {
        opportunity.stage = stage;
      }

      await opportunityRepository.save(opportunity);

      this.logger.log(`Synced Whop membership ${membershipId} successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to sync Whop membership ${membershipId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Extract unique users from memberships
   */
  private extractUniqueUsers(memberships: WhopMembership[]): WhopUser[] {
    const userMap = new Map<string, WhopUser>();

    memberships.forEach((membership) => {
      if (!userMap.has(membership.user.id)) {
        userMap.set(membership.user.id, membership.user);
      }
    });

    return Array.from(userMap.values());
  }

  /**
   * Sync Whop users to Person records
   */
  private async syncUsersToPersons(
    users: WhopUser[],
    workspaceId: string,
    connectedAccountId: string,
  ): Promise<void> {
    const personRepository =
      await this.twentyORMManager.getRepository<PersonWorkspaceEntity>(
        'person',
      );

    for (const user of users) {
      try {
        // Skip users without email
        if (!user.email) {
          this.logger.warn(
            `Skipping Whop user ${user.id} - no email address`,
          );
          continue;
        }

        // Check if person already exists
        const existingPerson = await personRepository.findOne({
          where: {
            emails: {
              primaryEmail: user.email,
            },
          },
        });

        if (existingPerson) {
          // Update existing person
          this.logger.debug(
            `Person already exists for Whop user ${user.id}, skipping`,
          );
          continue;
        }

        // Create new person
        const person = personRepository.create({
          name: {
            firstName: user.username || '',
            lastName: '',
          },
          emails: {
            primaryEmail: user.email,
            additionalEmails: [],
          },
          avatarUrl: user.profile_pic_url || null,
          // Note: In production, we'd store user.id in a custom field 'whopUserId'
        });

        await personRepository.save(person);
        this.logger.debug(`Created Person for Whop user ${user.id}`);
      } catch (error) {
        this.logger.error(`Failed to sync Whop user ${user.id}`, error);
      }
    }
  }

  /**
   * Sync Whop memberships to Opportunity records
   */
  private async syncMembershipsToOpportunities(
    memberships: WhopMembership[],
    products: WhopProduct[],
    workspaceId: string,
    connectedAccountId: string,
  ): Promise<void> {
    const opportunityRepository =
      await this.twentyORMManager.getRepository<OpportunityWorkspaceEntity>(
        'opportunity',
      );
    const personRepository =
      await this.twentyORMManager.getRepository<PersonWorkspaceEntity>(
        'person',
      );

    for (const membership of memberships) {
      try {
        // Find the associated person
        const person = await personRepository.findOne({
          where: {
            emails: {
              primaryEmail: membership.user.email || '',
            },
          },
        });

        const opportunityName = `${membership.product.name} - ${membership.user.username}`;

        // Check if opportunity already exists
        // Note: In production, we'd use a custom field 'whopMembershipId'
        const existingOpportunity = await opportunityRepository.findOne({
          where: {
            name: opportunityName,
          },
        });

        const stage = this.mapMembershipStatusToStage(membership);
        const closeDate = membership.expires_at
          ? new Date(membership.expires_at * 1000)
          : null;

        if (existingOpportunity) {
          // Update existing opportunity
          existingOpportunity.stage = stage;
          existingOpportunity.closeDate = closeDate;
          await opportunityRepository.save(existingOpportunity);
          this.logger.debug(
            `Updated Opportunity for Whop membership ${membership.id}`,
          );
        } else {
          // Create new opportunity
          const opportunity = opportunityRepository.create({
            name: opportunityName,
            stage,
            closeDate,
            pointOfContactId: person?.id || null,
            // Note: In production, we'd store membership.id in a custom field 'whopMembershipId'
          });

          await opportunityRepository.save(opportunity);
          this.logger.debug(
            `Created Opportunity for Whop membership ${membership.id}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to sync Whop membership ${membership.id}`,
          error,
        );
      }
    }
  }

  /**
   * Map Whop membership status to TwentyCRM Opportunity stage
   */
  private mapMembershipStatusToStage(membership: WhopMembership): string {
    if (membership.valid && !membership.cancel_at_period_end) {
      return 'CUSTOMER'; // Active customer
    }
    if (membership.valid && membership.cancel_at_period_end) {
      return 'NEGOTIATION'; // Pending cancellation
    }
    if (!membership.valid) {
      return 'LOST'; // Inactive/cancelled
    }

    return 'NEW'; // Default
  }
}
