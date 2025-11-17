# TwentyCRM × Whop Integration

This document provides an overview of the Whop platform integration with TwentyCRM.

## 🎯 Project Overview

This integration connects TwentyCRM with Whop, a digital product marketplace and licensing platform, enabling automatic synchronization of customers, memberships, and payment data.

## ✅ What's Implemented

### Backend Core (100%)
- ✅ **OAuth 2.0 Authentication** - Secure connection to Whop accounts
- ✅ **API Client** - Complete wrapper for Whop REST API
- ✅ **Data Synchronization** - Maps Whop data to CRM entities
- ✅ **Webhook Handler** - Real-time event processing
- ✅ **GraphQL API** - Query and mutation support

### Architecture
```
TwentyCRM
├── Auth Module
│   ├── whop-auth.controller.ts    # OAuth flow
│   └── whop.service.ts             # Token management
└── Whop Module
    ├── services/
    │   ├── whop-api-client.service.ts  # API wrapper
    │   └── whop-sync.service.ts        # Data sync
    ├── controllers/
    │   └── whop-webhook.controller.ts  # Webhooks
    └── whop.resolver.ts                # GraphQL
```

## 🚀 Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp packages/twenty-server/.env.example packages/twenty-server/.env

# Configure Whop credentials
AUTH_WHOP_CLIENT_ID=your_client_id
AUTH_WHOP_CLIENT_SECRET=your_client_secret
AUTH_WHOP_CALLBACK_URL=http://localhost:3000/auth/whop/callback
WHOP_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Start Development
```bash
yarn install
yarn start
```

### 3. Connect Whop Account
Navigate to: `http://localhost:3000/auth/whop?transientToken={TOKEN}&redirectLocation=/settings/accounts`

## 📊 Data Flow

### Whop → TwentyCRM Mapping

| Whop Entity | TwentyCRM Entity | Mapping Logic |
|-------------|------------------|---------------|
| User | Person (Contact) | Match by email |
| Product | Custom Object | Stored for reference |
| Membership | Opportunity | One membership = One opportunity |
| Payment | Activity Note | Logged in timeline |

### Membership Status Mapping

| Whop Status | CRM Stage | Description |
|-------------|-----------|-------------|
| valid + !cancel_at_period_end | CUSTOMER | Active customer |
| valid + cancel_at_period_end | NEGOTIATION | Pending cancellation |
| !valid | LOST | Cancelled/Expired |

## 🔌 API Endpoints

### OAuth
- `GET /auth/whop` - Start OAuth flow
- `GET /auth/whop/callback` - OAuth callback

### Webhooks
- `POST /webhooks/whop` - Receive Whop events

### GraphQL
```graphql
# Check connection status
query {
  whopConnectionStatus {
    isConnected
    lastSyncAt
    handle
  }
}

# Trigger manual sync
mutation {
  triggerWhopSync {
    success
    productsSync
    usersSync
    membershipsSync
    errors
  }
}

# Disconnect account
mutation {
  disconnectWhopAccount
}
```

## 📡 Webhook Events

Supported events:
- `membership.went_valid` - New or renewed membership
- `membership.went_invalid` - Cancelled or expired membership
- `payment.succeeded` - Successful payment
- `payment.failed` - Failed payment attempt

**Webhook URL**: `https://yourdomain.com/webhooks/whop`

## 🔒 Security

- **OAuth 2.0**: Secure authorization flow
- **Token Encryption**: Access/refresh tokens encrypted at rest
- **Signature Verification**: All webhooks verified with HMAC-SHA256
- **Workspace Isolation**: Automatic multi-tenant data separation

## 🧪 Testing

### Unit Tests
```bash
# Test backend services
npx nx test twenty-server

# Test frontend components
npx nx test twenty-front
```

### Integration Tests
```bash
# Test with database reset
npx nx run twenty-server:test:integration:with-db-reset
```

### Manual Testing Checklist
- [ ] Connect Whop account via OAuth
- [ ] Verify connection status appears
- [ ] Trigger manual sync
- [ ] Check Person records created
- [ ] Check Opportunity records created
- [ ] Send test webhook (membership.went_valid)
- [ ] Verify webhook processed successfully
- [ ] Disconnect Whop account
- [ ] Verify data persists after disconnect

## 📈 Future Enhancements

### Phase 2: AI Automations
- Lead scoring based on membership data
- Automatic email campaigns
- Sentiment analysis of customer interactions
- Churn prediction

### Phase 3: Contract Signing
- E-signature integration (DocuSign/HelloSign)
- Automated contract generation
- Membership agreement workflows

### Phase 4: Frontend Redesign
- Modern UI/UX
- Enhanced dashboard
- Improved mobile experience

### Custom Fields (Recommended)
Add to Person object:
- `whopUserId` - Whop user ID
- `whopUsername` - Whop username
- `whopProfileUrl` - Profile picture URL

Add to Opportunity object:
- `whopMembershipId` - Membership ID
- `whopMembershipStatus` - Current status
- `whopRenewalDate` - Next renewal date
- `whopProductName` - Product name

## 🐛 Known Issues

1. **Custom Fields Missing**: Currently using email matching instead of Whop IDs
2. **No Background Jobs**: Sync runs synchronously (should use BullMQ)
3. **Webhook Context**: Needs workspace lookup for multi-tenant support
4. **Frontend UI**: Settings page not yet implemented

## 📚 Documentation

- **Planning**: `docs/whop-integration-plan.md`
- **Status**: `docs/whop-integration-status.md`
- **Development Rules**: `rules.md`
- **Change Log**: `changes.md`

## 🤝 Contributing

### Development Workflow
1. Read `rules.md` for coding standards
2. Create feature branch from `main`
3. Implement changes following TwentyCRM patterns
4. Add tests for new functionality
5. Update `changes.md`
6. Submit pull request

### Code Style
- **Backend**: NestJS + TypeORM + GraphQL
- **Frontend**: React + Recoil + Apollo Client
- **Named exports only** (no default exports)
- **Types over interfaces**
- **No 'any' type**

## 📞 Support

- **Whop API Docs**: https://dev.whop.com
- **TwentyCRM Docs**: https://docs.twenty.com
- **Issues**: GitHub Issues

## 📄 License

AGPL-3.0 (same as TwentyCRM)

---

**Built with ❤️ for TwentyCRM**
