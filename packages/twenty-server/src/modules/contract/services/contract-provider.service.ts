import { Injectable, Logger } from '@nestjs/common';

import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import {
  ESignProvider,
  type SendContractRequest,
  type Contract,
  ContractStatus,
} from 'src/modules/contract/types/contract.types';

@Injectable()
export class ContractProviderService {
  private readonly logger = new Logger(ContractProviderService.name);
  private readonly provider: ESignProvider;

  constructor(private readonly twentyConfigService: TwentyConfigService) {
    const providerConfig = this.twentyConfigService.get('ESIGN_PROVIDER') || 'docusign';
    this.provider = providerConfig as ESignProvider;
  }

  /**
   * Send contract for signature
   */
  async sendContract(request: SendContractRequest): Promise<Contract> {
    this.logger.log(`Sending contract with ${this.provider}`);

    try {
      // Simulate sending contract
      // In production, integrate with actual e-signature provider SDK
      const contract: Contract = {
        id: `contract_${Date.now()}`,
        templateId: request.templateId,
        status: ContractStatus.SENT,
        signers: request.signers,
        expiresAt: request.expiresInDays
          ? new Date(Date.now() + request.expiresInDays * 24 * 60 * 60 * 1000)
          : undefined,
        metadata: {
          subject: request.subject,
          message: request.message,
          provider: this.provider,
        },
      };

      this.logger.log(`Contract sent: ${contract.id}`);
      return contract;
    } catch (error) {
      this.logger.error('Failed to send contract', error);
      throw new Error(`Contract sending failed: ${error.message}`);
    }
  }

  /**
   * Get contract status
   */
  async getContractStatus(contractId: string): Promise<ContractStatus> {
    this.logger.log(`Getting status for contract ${contractId}`);

    try {
      // Simulate getting contract status
      // In production, query actual e-signature provider
      return ContractStatus.SENT;
    } catch (error) {
      this.logger.error('Failed to get contract status', error);
      throw new Error(`Get contract status failed: ${error.message}`);
    }
  }

  /**
   * Get signed document URL
   */
  async getSignedDocumentUrl(contractId: string): Promise<string> {
    this.logger.log(`Getting signed document URL for ${contractId}`);

    try {
      // Simulate getting document URL
      // In production, get from actual e-signature provider
      return `https://example.com/signed-documents/${contractId}.pdf`;
    } catch (error) {
      this.logger.error('Failed to get signed document URL', error);
      throw new Error(`Get document URL failed: ${error.message}`);
    }
  }

  /**
   * Cancel/void contract
   */
  async cancelContract(contractId: string): Promise<boolean> {
    this.logger.log(`Cancelling contract ${contractId}`);

    try {
      // Simulate cancelling contract
      // In production, void with actual e-signature provider
      return true;
    } catch (error) {
      this.logger.error('Failed to cancel contract', error);
      throw new Error(`Cancel contract failed: ${error.message}`);
    }
  }

  /**
   * Handle webhook from e-signature provider
   */
  async handleWebhook(payload: unknown): Promise<void> {
    this.logger.log('Processing e-signature webhook');

    try {
      // Parse webhook payload based on provider
      // Update contract status in database
      // Trigger workflow actions if needed
      this.logger.log('Webhook processed successfully');
    } catch (error) {
      this.logger.error('Failed to process webhook', error);
      throw new Error(`Webhook processing failed: ${error.message}`);
    }
  }
}
