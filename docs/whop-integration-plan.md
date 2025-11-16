# Whop Integration Planning Document

**Date**: 2025-11-16
**Status**: Planning Complete
**Phase**: 1.1 - Whop API Research & Planning

---

## Executive Summary

This document outlines the complete integration strategy for connecting TwentyCRM with the Whop platform. Whop is a digital product marketplace and licensing platform that handles memberships, products, and payments.

---

## 1. Whop API Overview

### Authentication
- **Method**: OAuth 2.0
- **Token Type**: Bearer token
- **Flow**: Authorization Code Grant
- **Endpoints**:
  - Authorization: `https://whop.com/oauth?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}`
  - Token Exchange: `POST https://data.whop.com/api/v3/oauth/token`

### API Versions
- **OAuth**: v3
- **Core API**: v5 (latest), v2 (legacy)
- **Webhooks**: v5

### Base URLs
- OAuth: `https://data.whop.com/api/v3`
- API: `https://api.whop.com/v5` (assumed based on v5 documentation)
- Authorization Portal: `https://whop.com/oauth`

### SDK Availability
- **JavaScript/TypeScript**: `@whop/api` (official npm package)
- **Python**: `whop-sdk-py` (official)

---

## 2. Whop Data Models

### 2.1 Membership Object
Represents a user's purchase of a product. Key fields:
- `id` - Unique membership ID
- `user` - Associated user object (expandable)
- `product` - Associated product object (expandable)
- `plan` - Pricing plan object (expandable)
- `status` - valid/invalid
- `valid` - Boolean indicating current validity
- `cancel_at_period_end` - Boolean for subscription cancellation
- `created_at` - Timestamp
- `expires_at` - Timestamp (for non-subscription)
- `renewal_period_start` - Timestamp
- `renewal_period_end` - Timestamp

**Mapping to TwentyCRM**:
- Membership → Opportunity/Deal (with custom status)
- Can also create custom "Membership" object

### 2.2 Product Object
Represents what customers can purchase. Key fields:
- `id` - Unique product ID
- `name` - Product name
- `description` - Product description
- `visibility` - public/private/hidden
- `created_at` - Timestamp
- `experiences` - Array of access experiences

**Mapping to TwentyCRM**:
- Product → Custom Object "WhopProduct"
- Link to Opportunities via product reference

### 2.3 User Object
Represents a customer. Key fields:
- `id` - Unique user ID
- `username` - Username
- `email` - Email address
- `profile_pic_url` - Avatar URL
- `created_at` - Timestamp

**Mapping to TwentyCRM**:
- User → Person (Contact)
- Create/update Person records for each Whop user

### 2.4 Payment Object
Represents payment transactions. Key fields:
- `id` - Payment ID
- `amount` - Payment amount
- `status` - succeeded/failed/pending
- `created_at` - Timestamp

**Mapping to TwentyCRM**:
- Can track in custom fields on Opportunity
- Or create activity timeline entry

---

## 3. Webhook Events

### Available Events

#### 3.1 membership.went_valid
- **Trigger**: Membership becomes active (new purchase or renewal)
- **Payload**: Full membership object with expanded user, product, plan
- **Action in CRM**:
  - Create/update Person (from user)
  - Create/update Opportunity (from membership)
  - Set opportunity status to "Active Member"

#### 3.2 membership.went_invalid
- **Trigger**: Membership becomes inactive (cancellation, expiration, payment failure)
- **Payload**: Full membership object
- **Action in CRM**:
  - Update Opportunity status to "Cancelled" or "Expired"
  - Add activity note to Person timeline

#### 3.3 payment.succeeded
- **Trigger**: Successful payment (new or recurring)
- **Payload**: Payment object with membership
- **Action in CRM**:
  - Add activity note to Opportunity
  - Update "Last Payment Date" field
  - Track revenue

#### 3.4 payment.failed
- **Trigger**: Failed payment attempt
- **Payload**: Payment object with failure reason
- **Action in CRM**:
  - Update Opportunity status to "Payment Failed"
  - Create task for follow-up
  - Add activity note

### Webhook Security
- **Verification**: Signature verification using webhook secret
- **Header**: `X-Whop-Signature` (assumed based on common patterns)
- **Retry Logic**: Whop implements automatic retries with exponential backoff

---

## 4. API Endpoints (Required for Integration)

### 4.1 Memberships
```
GET /v5/memberships - List all memberships
GET /v5/memberships/{id} - Get specific membership
POST /v5/memberships/{id} - Update membership (if supported)
```

### 4.2 Products
```
GET /v5/products - List all products
GET /v5/products/{id} - Get specific product
```

### 4.3 Users
```
GET /v5/users/{id} - Get user by ID
GET /v5/me - Get authenticated user (likely available)
```

### 4.4 OAuth
```
POST /v3/oauth/token - Exchange code for access token
POST /v3/oauth/token - Refresh access token (grant_type=refresh_token)
```

---

## 5. Data Synchronization Strategy

### 5.1 Initial Sync
When user first connects Whop account:
1. Fetch all products → Create WhopProduct custom objects
2. Fetch all memberships (paginated) → Create Person + Opportunity records
3. Store sync timestamp for incremental updates

### 5.2 Incremental Sync (Webhook-driven)
- Primary method: Real-time webhooks for membership/payment events
- Backup method: Scheduled job (every 1 hour) to catch missed webhooks
- Conflict resolution: Last-write-wins (Whop is source of truth)

### 5.3 Bidirectional Sync
**Phase 1**: Unidirectional (Whop → TwentyCRM) - Read-only
**Phase 2 (Future)**: Bidirectional - Allow CRM to create/cancel memberships

---

## 6. OAuth Flow Implementation

### 6.1 Authorization Flow
```
1. User clicks "Connect Whop" in TwentyCRM settings
2. Redirect to: https://whop.com/oauth?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}
3. User authorizes on Whop
4. Whop redirects to: {REDIRECT_URI}?code={AUTHORIZATION_CODE}
5. Backend exchanges code for tokens:
   POST /v3/oauth/token
   {
     "grant_type": "authorization_code",
     "code": "{CODE}",
     "client_id": "{CLIENT_ID}",
     "client_secret": "{CLIENT_SECRET}",
     "redirect_uri": "{REDIRECT_URI}"
   }
6. Response contains: access_token, refresh_token, expires_in
7. Store tokens in connectedAccount entity (encrypted)
```

### 6.2 Token Refresh
```
When access_token expires:
POST /v3/oauth/token
{
  "grant_type": "refresh_token",
  "refresh_token": "{REFRESH_TOKEN}",
  "client_id": "{CLIENT_ID}",
  "client_secret": "{CLIENT_SECRET}"
}
```

### 6.3 Required Scopes
- To be determined from Whop documentation
- Likely: `memberships:read`, `products:read`, `users:read`

---

## 7. TwentyCRM Schema Extensions

### 7.1 New Custom Objects

#### WhopProduct
```typescript
{
  standardId: '@whop/product',
  fields: {
    whopId: string (unique, indexed),
    name: string,
    description: text,
    visibility: string,
    createdAt: datetime,
    syncedAt: datetime,
  },
  icon: 'IconShoppingCart',
  labelSingular: 'Whop Product',
  labelPlural: 'Whop Products',
}
```

### 7.2 Extended Standard Objects

#### Person (Contact)
Add custom fields:
- `whopUserId`: string (unique, indexed) - Whop user ID
- `whopUsername`: string - Whop username
- `whopProfilePicUrl`: string - Avatar URL
- `whopCreatedAt`: datetime - When created on Whop
- `whopSyncedAt`: datetime - Last sync timestamp

#### Opportunity
Add custom fields:
- `whopMembershipId`: string (unique, indexed) - Whop membership ID
- `whopMembershipStatus`: select (Active, Cancelled, Expired, Payment Failed)
- `whopProductId`: relation to WhopProduct
- `whopPlanId`: string - Plan identifier
- `whopRenewalDate`: datetime - Next renewal
- `whopLastPaymentDate`: datetime - Last successful payment
- `whopCancelAtPeriodEnd`: boolean - Scheduled cancellation

### 7.3 New Core Entities

#### WhopConnection (in core schema)
```typescript
@Entity({ name: 'whopConnection', schema: 'core' })
class WhopConnectionWorkspaceEntity {
  id: uuid;
  workspaceId: uuid;
  accessToken: string (encrypted);
  refreshToken: string (encrypted);
  expiresAt: datetime;
  whopUserId: string; // The authenticated Whop user
  status: 'active' | 'expired' | 'revoked';
  lastSyncAt: datetime;
  createdAt: datetime;
  updatedAt: datetime;
}
```

#### WhopSyncLog (for debugging)
```typescript
@Entity({ name: 'whopSyncLog', schema: 'core' })
class WhopSyncLogWorkspaceEntity {
  id: uuid;
  workspaceId: uuid;
  connectionId: uuid;
  syncType: 'full' | 'incremental' | 'webhook';
  status: 'success' | 'failed' | 'partial';
  recordsProcessed: integer;
  errorMessage: text;
  startedAt: datetime;
  completedAt: datetime;
}
```

---

## 8. Implementation Architecture

### 8.1 Backend Module Structure
```
packages/twenty-server/src/modules/whop/
├── whop.module.ts
├── services/
│   ├── whop-oauth.service.ts          # OAuth token management
│   ├── whop-api-client.service.ts     # API wrapper
│   ├── whop-sync.service.ts           # Data synchronization logic
│   └── whop-mapping.service.ts        # Whop ↔ CRM data mapping
├── jobs/
│   ├── whop-full-sync.job.ts          # Initial full sync
│   └── whop-incremental-sync.job.ts   # Scheduled incremental sync
├── controllers/
│   └── whop-webhook.controller.ts     # Webhook receiver
├── resolvers/
│   └── whop.resolver.ts               # GraphQL API
├── dto/
│   ├── connect-whop.input.ts
│   ├── whop-sync-status.output.ts
│   └── ...
├── entities/
│   ├── whop-connection.entity.ts
│   └── whop-sync-log.entity.ts
└── types/
    ├── whop-api.types.ts              # API response types
    └── whop-webhook.types.ts          # Webhook payload types
```

### 8.2 Frontend Module Structure
```
packages/twenty-front/src/modules/whop/
├── components/
│   ├── WhopConnectionButton.tsx       # OAuth trigger
│   ├── WhopConnectionStatus.tsx       # Connection status display
│   ├── WhopSyncStatus.tsx             # Sync progress
│   ├── WhopProductBadge.tsx           # Product indicator
│   └── WhopMembershipTimeline.tsx     # Membership history
├── hooks/
│   ├── useWhopConnection.ts
│   ├── useWhopSync.ts
│   └── useWhopData.ts
├── states/
│   ├── whopConnectionState.ts         # Recoil atom
│   └── whopSyncStatusState.ts
├── graphql/
│   ├── mutations/
│   │   ├── connectWhop.ts
│   │   ├── disconnectWhop.ts
│   │   └── triggerWhopSync.ts
│   └── queries/
│       ├── whopConnection.ts
│       └── whopSyncStatus.ts
└── __tests__/
    └── ...
```

---

## 9. Error Handling & Edge Cases

### 9.1 OAuth Errors
- User denies authorization → Show friendly message, allow retry
- Invalid credentials → Show configuration error
- Token expired → Auto-refresh, fallback to re-authorization

### 9.2 API Errors
- Rate limiting (429) → Exponential backoff, queue requests
- Unauthorized (401) → Refresh token, re-authorize if needed
- Not Found (404) → Log error, skip record
- Server Error (5xx) → Retry with backoff, alert admin

### 9.3 Webhook Errors
- Invalid signature → Reject, log security event
- Duplicate event → Idempotency key check, skip processing
- Unknown event type → Log, ignore gracefully
- Processing failure → Return 5xx to trigger Whop retry

### 9.4 Data Conflicts
- Duplicate records → Match on whopUserId/whopMembershipId
- Stale data → Use timestamp comparison
- Missing parent record → Create parent first (user before membership)

---

## 10. Testing Strategy

### 10.1 Unit Tests
- OAuth token exchange
- API client methods
- Data mapping functions
- Webhook signature verification

### 10.2 Integration Tests
- Full OAuth flow (with mocked Whop)
- Complete sync workflow
- Webhook processing pipeline
- Error recovery scenarios

### 10.3 Manual Testing Checklist
- [ ] Connect Whop account successfully
- [ ] Initial sync completes without errors
- [ ] Webhook received and processed
- [ ] Data appears correctly in CRM
- [ ] Disconnect Whop account
- [ ] Reconnect after disconnection
- [ ] Handle expired tokens gracefully

---

## 11. Security Considerations

### 11.1 Token Storage
- ✅ Encrypt access_token and refresh_token at rest
- ✅ Never log tokens
- ✅ Use workspace isolation for multi-tenant security

### 11.2 Webhook Security
- ✅ Verify webhook signatures
- ✅ Validate payload structure
- ✅ Rate limit webhook endpoint
- ✅ Use HTTPS only

### 11.3 API Security
- ✅ Never expose client_secret to frontend
- ✅ Use environment variables for credentials
- ✅ Implement rate limiting on sync jobs
- ✅ Log all API errors for monitoring

---

## 12. Environment Variables

```bash
# Whop OAuth Credentials
WHOP_CLIENT_ID=your_client_id_here
WHOP_CLIENT_SECRET=your_client_secret_here
WHOP_REDIRECT_URI=https://yourdomain.com/auth/whop/callback

# Whop Webhook
WHOP_WEBHOOK_SECRET=your_webhook_secret_here

# Whop API Configuration
WHOP_API_URL=https://api.whop.com/v5
WHOP_OAUTH_URL=https://data.whop.com/api/v3
WHOP_AUTH_URL=https://whop.com/oauth

# Sync Configuration
WHOP_SYNC_ENABLED=true
WHOP_SYNC_INTERVAL_MINUTES=60
WHOP_SYNC_BATCH_SIZE=100
```

---

## 13. Performance Optimization

### 13.1 Pagination
- Use cursor-based pagination for large datasets
- Batch size: 100 records per request
- Parallel processing where possible

### 13.2 Caching
- Cache product list (refresh every 24 hours)
- Cache user data (refresh on webhook or 1 hour)
- Use Redis for distributed caching

### 13.3 Background Jobs
- All sync operations run in background (BullMQ)
- Priority queue: webhooks > incremental > full sync
- Limit concurrent jobs to avoid rate limits

---

## 14. Monitoring & Logging

### 14.1 Metrics to Track
- Connection success/failure rate
- Sync duration and record count
- API error rates by endpoint
- Webhook delivery success rate
- Token refresh frequency

### 14.2 Alerts
- Failed OAuth connections
- Sync errors exceeding threshold
- Webhook processing failures
- API rate limit warnings

### 14.3 Logging
- Log all API requests (without sensitive data)
- Log webhook events with payload (redacted)
- Log sync progress and errors
- Structured logging with correlation IDs

---

## 15. Rollout Plan

### Phase 1: Core Integration (Week 1-2)
- ✅ OAuth implementation
- ✅ API client service
- ✅ Basic data sync (users → persons, memberships → opportunities)
- ✅ Webhook handler for core events

### Phase 2: Enhanced Sync (Week 3)
- ✅ Product sync
- ✅ Incremental sync optimization
- ✅ Error handling improvements
- ✅ Admin UI for connection management

### Phase 3: Advanced Features (Week 4)
- ✅ Timeline components
- ✅ Advanced filtering by Whop data
- ✅ Comprehensive testing
- ✅ Documentation

---

## 16. Success Criteria

- ✅ OAuth connection succeeds on first attempt
- ✅ Initial sync completes for 10,000 records in < 5 minutes
- ✅ Webhooks processed within 5 seconds of receipt
- ✅ Data accuracy: 99.9% match with Whop platform
- ✅ Zero data leaks between workspaces
- ✅ API error rate < 1%
- ✅ User satisfaction: Can view all Whop data in CRM

---

## 17. Future Enhancements (Post-Phase 1)

- Bidirectional sync (create/cancel memberships from CRM)
- Revenue analytics and reporting
- Churn prediction using AI
- Automated email campaigns based on membership status
- Integration with contract signing for membership agreements
- Whop-triggered workflows (e.g., send welcome email on membership.went_valid)

---

**Next Steps**: Proceed to Phase 1.2 - Backend OAuth Integration Implementation

**Document Version**: 1.0
**Last Updated**: 2025-11-16
