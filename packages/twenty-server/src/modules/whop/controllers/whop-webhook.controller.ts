import {
  Controller,
  Post,
  Body,
  Headers,
  HttpCode,
  Logger,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import * as crypto from 'crypto';

import { AuthRestApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-rest-api-exception.filter';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { WhopSyncService } from 'src/modules/whop/services/whop-sync.service';
import {
  WhopWebhookEvent,
  type WhopWebhookPayload,
  type WhopWebhookMembershipData,
} from 'src/modules/whop/types/whop-webhook.types';

@Controller('webhooks/whop')
@UseFilters(AuthRestApiExceptionFilter)
export class WhopWebhookController {
  private readonly logger = new Logger(WhopWebhookController.name);

  constructor(
    private readonly whopSyncService: WhopSyncService,
    private readonly twentyConfigService: TwentyConfigService,
  ) {}

  @Post()
  @HttpCode(200)
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async handleWebhook(
    @Body() payload: WhopWebhookPayload,
    @Headers('x-whop-signature') signature: string,
  ): Promise<{ received: boolean }> {
    this.logger.log(`Received Whop webhook: ${payload.event}`);

    // Verify webhook signature
    if (!this.verifyWebhookSignature(JSON.stringify(payload), signature)) {
      this.logger.warn('Invalid Whop webhook signature');
      throw new Error('Invalid webhook signature');
    }

    try {
      // Handle different webhook events
      switch (payload.event) {
        case WhopWebhookEvent.MEMBERSHIP_WENT_VALID:
          await this.handleMembershipWentValid(
            payload.data as WhopWebhookMembershipData,
          );
          break;

        case WhopWebhookEvent.MEMBERSHIP_WENT_INVALID:
          await this.handleMembershipWentInvalid(
            payload.data as WhopWebhookMembershipData,
          );
          break;

        case WhopWebhookEvent.PAYMENT_SUCCEEDED:
          await this.handlePaymentSucceeded(payload.data);
          break;

        case WhopWebhookEvent.PAYMENT_FAILED:
          await this.handlePaymentFailed(payload.data);
          break;

        default:
          this.logger.warn(`Unhandled Whop webhook event: ${payload.event}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error('Failed to handle Whop webhook', error);
      // Return 200 to avoid Whop retrying on temporary errors
      // Log the error for manual review
      return { received: true };
    }
  }

  /**
   * Handle membership.went_valid event
   */
  private async handleMembershipWentValid(
    data: WhopWebhookMembershipData,
  ): Promise<void> {
    this.logger.log(
      `Processing membership.went_valid for membership ${data.id}`,
    );

    // Note: In production, we need to:
    // 1. Find the workspace associated with this Whop data
    // 2. Get the access token for that workspace
    // 3. Call syncMembership with proper context

    // For now, we'll log this event
    // TODO: Implement workspace lookup and sync
    this.logger.debug(
      `Membership ${data.id} for product ${data.product.name} is now valid`,
    );
  }

  /**
   * Handle membership.went_invalid event
   */
  private async handleMembershipWentInvalid(
    data: WhopWebhookMembershipData,
  ): Promise<void> {
    this.logger.log(
      `Processing membership.went_invalid for membership ${data.id}`,
    );

    // Note: Similar to above, need workspace context
    // TODO: Implement workspace lookup and sync
    this.logger.debug(
      `Membership ${data.id} for product ${data.product.name} is now invalid`,
    );
  }

  /**
   * Handle payment.succeeded event
   */
  private async handlePaymentSucceeded(data: unknown): Promise<void> {
    this.logger.log('Processing payment.succeeded event');

    // TODO: Update opportunity with payment information
    this.logger.debug(`Payment succeeded: ${JSON.stringify(data)}`);
  }

  /**
   * Handle payment.failed event
   */
  private async handlePaymentFailed(data: unknown): Promise<void> {
    this.logger.log('Processing payment.failed event');

    // TODO: Update opportunity status and create task for follow-up
    this.logger.debug(`Payment failed: ${JSON.stringify(data)}`);
  }

  /**
   * Verify webhook signature from Whop
   */
  private verifyWebhookSignature(
    payload: string,
    signature: string,
  ): boolean {
    const webhookSecret = this.twentyConfigService.get('WHOP_WEBHOOK_SECRET');

    if (!webhookSecret) {
      this.logger.warn('WHOP_WEBHOOK_SECRET not configured, skipping verification');
      return true; // Allow in development
    }

    if (!signature) {
      return false;
    }

    try {
      // Whop typically uses HMAC-SHA256 for signature verification
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    } catch (error) {
      this.logger.error('Error verifying webhook signature', error);
      return false;
    }
  }
}
