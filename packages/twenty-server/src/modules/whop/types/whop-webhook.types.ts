// Whop Webhook Event Types
export enum WhopWebhookEvent {
  MEMBERSHIP_WENT_VALID = 'membership.went_valid',
  MEMBERSHIP_WENT_INVALID = 'membership.went_invalid',
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',
}

// Webhook Payload Structure
export type WhopWebhookPayload = {
  event: WhopWebhookEvent;
  data: WhopWebhookMembershipData | WhopWebhookPaymentData;
};

export type WhopWebhookMembershipData = {
  id: string;
  user: {
    id: string;
    username: string;
    email?: string;
    profile_pic_url?: string;
  };
  product: {
    id: string;
    name: string;
    description?: string;
  };
  plan: {
    id: string;
    plan_type: string;
  };
  status: string;
  valid: boolean;
  cancel_at_period_end: boolean;
  license_key?: string;
  quantity: number;
  renewal_period_start: number;
  renewal_period_end: number;
  created_at: number;
  expires_at?: number;
};

export type WhopWebhookPaymentData = {
  id: string;
  membership_id: string;
  user_id: string;
  product_id: string;
  final_amount: number;
  subtotal: number;
  currency: string;
  status: 'paid' | 'failed' | 'refunded';
  created_at: number;
  refunded_at?: number;
  affiliates?: Array<{
    username: string;
    amount: number;
  }>;
};
