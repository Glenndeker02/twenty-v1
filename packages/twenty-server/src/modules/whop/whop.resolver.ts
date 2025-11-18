import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { Workspace } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import { JwtAuthGuard } from 'src/engine/guards/jwt.auth.guard';
import { WhopSyncService, type WhopSyncResult } from 'src/modules/whop/services/whop-sync.service';
import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';
import { ConnectedAccountProvider } from 'twenty-shared/types';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

// GraphQL Types
export class WhopSyncResultType {
  success: boolean;
  productsSync: number;
  usersSync: number;
  membershipsSync: number;
  errors: string[];
}

export class WhopConnectionStatusType {
  isConnected: boolean;
  lastSyncAt?: Date;
  handle?: string;
}

@Resolver()
@UseGuards(JwtAuthGuard)
export class WhopResolver {
  constructor(
    private readonly whopSyncService: WhopSyncService,
    private readonly twentyORMManager: TwentyORMManager,
  ) {}

  @Query(() => WhopConnectionStatusType)
  async whopConnectionStatus(
    @AuthWorkspace() workspace: Workspace,
  ): Promise<WhopConnectionStatusType> {
    const connectedAccountRepository =
      await this.twentyORMManager.getRepository<ConnectedAccountWorkspaceEntity>(
        'connectedAccount',
      );

    const whopConnection = await connectedAccountRepository.findOne({
      where: {
        provider: ConnectedAccountProvider.WHOP,
      },
    });

    if (!whopConnection) {
      return {
        isConnected: false,
      };
    }

    return {
      isConnected: true,
      lastSyncAt: whopConnection.lastCredentialsRefreshedAt || undefined,
      handle: whopConnection.handle,
    };
  }

  @Mutation(() => WhopSyncResultType)
  async triggerWhopSync(
    @AuthWorkspace() workspace: Workspace,
  ): Promise<WhopSyncResult> {
    // Get the current workspace member
    // Note: In production, we'd get this from the auth context
    const connectedAccountRepository =
      await this.twentyORMManager.getRepository<ConnectedAccountWorkspaceEntity>(
        'connectedAccount',
      );

    const whopConnection = await connectedAccountRepository.findOne({
      where: {
        provider: ConnectedAccountProvider.WHOP,
      },
    });

    if (!whopConnection) {
      return {
        success: false,
        productsSync: 0,
        usersSync: 0,
        membershipsSync: 0,
        errors: ['Whop connection not found'],
      };
    }

    const result = await this.whopSyncService.performFullSync(
      workspace.id,
      whopConnection.accountOwnerId,
    );

    return result;
  }

  @Mutation(() => Boolean)
  async disconnectWhopAccount(
    @AuthWorkspace() workspace: Workspace,
  ): Promise<boolean> {
    const connectedAccountRepository =
      await this.twentyORMManager.getRepository<ConnectedAccountWorkspaceEntity>(
        'connectedAccount',
      );

    const whopConnection = await connectedAccountRepository.findOne({
      where: {
        provider: ConnectedAccountProvider.WHOP,
      },
    });

    if (!whopConnection) {
      return false;
    }

    await connectedAccountRepository.delete({ id: whopConnection.id });

    return true;
  }
}
