import { Injectable, Logger } from '@nestjs/common';

import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { OpportunityWorkspaceEntity } from 'src/modules/opportunity/standard-objects/opportunity.workspace-entity';

export type WorkspaceInsights = {
  totalCustomers: number;
  totalCompanies: number;
  totalOpportunities: number;
  topIndustries: string[];
  customerInterests: string[];
  averageOpportunityValue: number;
  conversionRate: number;
  topCompanies: string[];
  recentActivity: string;
};

@Injectable()
export class CrmInsightsService {
  private readonly logger = new Logger(CrmInsightsService.name);

  constructor(private readonly twentyORMManager: TwentyORMManager) {}

  /**
   * Get comprehensive insights about a workspace's CRM data
   */
  async getWorkspaceInsights(workspaceId: string): Promise<WorkspaceInsights> {
    this.logger.log(`Gathering CRM insights for workspace ${workspaceId}`);

    try {
      const [
        totalCustomers,
        totalCompanies,
        totalOpportunities,
        topIndustries,
        topCompanies,
        averageOpportunityValue,
      ] = await Promise.all([
        this.getTotalCustomers(workspaceId),
        this.getTotalCompanies(workspaceId),
        this.getTotalOpportunities(workspaceId),
        this.getTopIndustries(workspaceId),
        this.getTopCompanies(workspaceId),
        this.getAverageOpportunityValue(workspaceId),
      ]);

      return {
        totalCustomers,
        totalCompanies,
        totalOpportunities,
        topIndustries,
        customerInterests: [], // Could be enhanced with more analysis
        averageOpportunityValue,
        conversionRate: 0, // Would need historical data
        topCompanies,
        recentActivity: 'Active', // Could be enhanced with timeline analysis
      };
    } catch (error) {
      this.logger.error(
        `Error gathering CRM insights: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Get insights about a specific person/customer
   */
  async getPersonInsights(
    workspaceId: string,
    personId: string,
  ): Promise<{
    person: PersonWorkspaceEntity;
    company: CompanyWorkspaceEntity | null;
    totalInteractions: number;
    recentActivity: string[];
  }> {
    this.logger.log(
      `Gathering insights for person ${personId} in workspace ${workspaceId}`,
    );

    const personRepository =
      await this.twentyORMManager.getRepository<PersonWorkspaceEntity>(
        'person',
      );

    const person = await personRepository.findOne({
      where: { id: personId },
      relations: ['company'],
    });

    if (!person) {
      throw new Error(`Person ${personId} not found`);
    }

    // Get company details if available
    let company: CompanyWorkspaceEntity | null = null;

    if ((person as any).companyId) {
      const companyRepository =
        await this.twentyORMManager.getRepository<CompanyWorkspaceEntity>(
          'company',
        );
      company = await companyRepository.findOne({
        where: { id: (person as any).companyId },
      });
    }

    return {
      person,
      company,
      totalInteractions: 0, // Would need to query activities/messages
      recentActivity: [], // Would need timeline data
    };
  }

  /**
   * Get insights about a specific company
   */
  async getCompanyInsights(
    workspaceId: string,
    companyId: string,
  ): Promise<{
    company: CompanyWorkspaceEntity;
    totalEmployees: number;
    totalOpportunities: number;
    totalRevenue: number;
  }> {
    this.logger.log(
      `Gathering insights for company ${companyId} in workspace ${workspaceId}`,
    );

    const companyRepository =
      await this.twentyORMManager.getRepository<CompanyWorkspaceEntity>(
        'company',
      );

    const company = await companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error(`Company ${companyId} not found`);
    }

    // Get opportunities for this company
    const opportunityRepository =
      await this.twentyORMManager.getRepository<OpportunityWorkspaceEntity>(
        'opportunity',
      );

    const opportunities = await opportunityRepository.find({
      where: {
        companyId: companyId as any,
      },
    });

    const totalRevenue = opportunities.reduce((sum, opp) => {
      return sum + ((opp as any).amount || 0);
    }, 0);

    return {
      company,
      totalEmployees: (company as any).employees || 0,
      totalOpportunities: opportunities.length,
      totalRevenue,
    };
  }

  // Private helper methods

  private async getTotalCustomers(workspaceId: string): Promise<number> {
    try {
      const personRepository =
        await this.twentyORMManager.getRepository<PersonWorkspaceEntity>(
          'person',
        );

      const count = await personRepository.count();

      return count;
    } catch (error) {
      this.logger.warn(`Error getting total customers: ${error}`);
      return 0;
    }
  }

  private async getTotalCompanies(workspaceId: string): Promise<number> {
    try {
      const companyRepository =
        await this.twentyORMManager.getRepository<CompanyWorkspaceEntity>(
          'company',
        );

      const count = await companyRepository.count();

      return count;
    } catch (error) {
      this.logger.warn(`Error getting total companies: ${error}`);
      return 0;
    }
  }

  private async getTotalOpportunities(workspaceId: string): Promise<number> {
    try {
      const opportunityRepository =
        await this.twentyORMManager.getRepository<OpportunityWorkspaceEntity>(
          'opportunity',
        );

      const count = await opportunityRepository.count();

      return count;
    } catch (error) {
      this.logger.warn(`Error getting total opportunities: ${error}`);
      return 0;
    }
  }

  private async getTopIndustries(workspaceId: string): Promise<string[]> {
    try {
      // This would need a proper implementation based on company data
      // For now, returning empty array
      return [];
    } catch (error) {
      this.logger.warn(`Error getting top industries: ${error}`);
      return [];
    }
  }

  private async getTopCompanies(workspaceId: string): Promise<string[]> {
    try {
      const companyRepository =
        await this.twentyORMManager.getRepository<CompanyWorkspaceEntity>(
          'company',
        );

      const companies = await companyRepository.find({
        take: 5,
        order: {
          createdAt: 'DESC',
        },
      });

      return companies.map((c) => c.name);
    } catch (error) {
      this.logger.warn(`Error getting top companies: ${error}`);
      return [];
    }
  }

  private async getAverageOpportunityValue(
    workspaceId: string,
  ): Promise<number> {
    try {
      const opportunityRepository =
        await this.twentyORMManager.getRepository<OpportunityWorkspaceEntity>(
          'opportunity',
        );

      const opportunities = await opportunityRepository.find();

      if (opportunities.length === 0) return 0;

      const total = opportunities.reduce((sum, opp) => {
        return sum + ((opp as any).amount || 0);
      }, 0);

      return total / opportunities.length;
    } catch (error) {
      this.logger.warn(`Error getting average opportunity value: ${error}`);
      return 0;
    }
  }
}
