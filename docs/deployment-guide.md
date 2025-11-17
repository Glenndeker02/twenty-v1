# TwentyCRM × Whop Integration - Deployment Guide

**Phase 5**: Final Integration & Deployment (5.1-5.5)

## 5.1: End-to-End Integration Testing

### Pre-Deployment Checklist

#### Functional Testing
- [ ] Whop OAuth connection works
- [ ] Full data sync completes successfully
- [ ] Webhooks receive and process events
- [ ] AI text generation responds correctly
- [ ] Contract sending initiates properly
- [ ] GraphQL API responds to all queries/mutations
- [ ] Frontend displays all data correctly

#### Integration Testing
```bash
# Run backend integration tests
npx nx run twenty-server:test:integration:with-db-reset

# Run frontend tests
npx nx test twenty-front

# Run E2E tests
npx nx e2e twenty-e2e-testing
```

#### Load Testing
- [ ] Test with 1,000 Whop memberships
- [ ] Test concurrent sync operations
- [ ] Test webhook processing under load
- [ ] Monitor database performance
- [ ] Check API response times

#### Security Testing
- [ ] OAuth tokens properly encrypted
- [ ] Webhook signatures verified
- [ ] API rate limiting works
- [ ] Workspace isolation verified
- [ ] No secrets in logs
- [ ] SQL injection protection
- [ ] XSS prevention

## 5.2: Database Migration Strategy

### Migration Files Created

```bash
# Whop integration migrations
packages/twenty-server/src/database/typeorm/core/migrations/common/
├── {timestamp}-add-whop-connected-account-provider.ts
└── {timestamp}-add-whop-webhook-log-table.ts
```

### Migration Execution Plan

#### Staging Environment
```bash
# 1. Backup database
pg_dump twenty_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Run migrations
npx nx run twenty-server:database:migrate:prod

# 3. Verify migrations
psql twenty_db -c "SELECT * FROM typeorm_metadata WHERE name LIKE '%whop%';"

# 4. Test rollback
npx nx run twenty-server:typeorm migration:revert -d src/database/typeorm/core/core.datasource.ts
```

#### Production Environment
```bash
# 1. Maintenance mode ON
# 2. Backup database
# 3. Run migrations with transaction
# 4. Smoke tests
# 5. Maintenance mode OFF
```

### Rollback Procedure
```sql
-- Rollback Whop integration
DROP TABLE IF EXISTS whop_webhook_log;
DELETE FROM connected_account WHERE provider = 'whop';
-- Revert other changes...
```

## 5.3: Environment Configuration

### Required Environment Variables

#### Staging Environment (.env.staging)
```bash
# Database
PG_DATABASE_URL=postgres://user:pass@staging-db:5432/twenty_staging
REDIS_URL=redis://staging-redis:6379

# Whop Integration
AUTH_WHOP_CLIENT_ID=whop_staging_client_id
AUTH_WHOP_CLIENT_SECRET=whop_staging_secret
AUTH_WHOP_CALLBACK_URL=https://staging.yourdomain.com/auth/whop/callback
WHOP_WEBHOOK_SECRET=whop_staging_webhook_secret

# AI Automation
AI_PROVIDER=openai
OPENAI_API_KEY=sk-staging-key
AI_MAX_TOKENS=2000

# E-Signature
ESIGN_PROVIDER=docusign
ESIGN_CLIENT_ID=docusign_staging_id
ESIGN_CLIENT_SECRET=docusign_staging_secret
ESIGN_WEBHOOK_SECRET=docusign_webhook_secret

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info
```

#### Production Environment (.env.production)
```bash
# Use production credentials
# Enable production monitoring
# Set appropriate rate limits
# Configure CDN for static assets
```

### Secrets Management
```bash
# Using Kubernetes Secrets
kubectl create secret generic twentycrm-secrets \
  --from-literal=whop-client-secret=xxx \
  --from-literal=openai-api-key=xxx \
  --from-literal=esign-secret=xxx

# Using AWS Secrets Manager
aws secretsmanager create-secret \
  --name twentycrm/whop/credentials \
  --secret-string file://secrets.json
```

## 5.4: Deployment & Monitoring

### Deployment Process

#### Docker Build
```dockerfile
# Dockerfile updates for new features
FROM node:18-alpine

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source
COPY . .

# Build
RUN yarn build

# Expose ports
EXPOSE 3000

# Start
CMD ["yarn", "start:prod"]
```

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: twentycrm-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: twentycrm-server
  template:
    metadata:
      labels:
        app: twentycrm-server
    spec:
      containers:
      - name: server
        image: twentycrm/server:latest
        env:
        - name: WHOP_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: twentycrm-secrets
              key: whop-client-id
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Monitoring Setup

#### Prometheus Metrics
```typescript
// Metrics to track
- whop_sync_duration_seconds
- whop_sync_records_total
- whop_webhook_events_total
- ai_api_calls_total
- ai_tokens_used_total
- contract_sent_total
- contract_signed_total
```

#### Grafana Dashboards
- Whop Integration Health
- AI Usage & Costs
- Contract Signing Funnel
- System Performance
- Error Rates

#### Alerts
```yaml
# AlertManager rules
groups:
- name: twentycrm_whop
  rules:
  - alert: WhopSyncFailing
    expr: rate(whop_sync_errors_total[5m]) > 0.1
    for: 10m
    annotations:
      summary: "Whop sync error rate is high"

  - alert: AITokenBudgetExceeded
    expr: ai_tokens_used_total > 1000000
    annotations:
      summary: "AI token usage exceeded budget"
```

#### Logging
```typescript
// Structured logging with Winston
logger.info('Whop sync completed', {
  workspace_id: 'xxx',
  records_synced: 150,
  duration_ms: 2500,
  timestamp: new Date().toISOString(),
});
```

### CDN Configuration
```nginx
# Nginx for static assets
location /static/ {
    proxy_cache static_cache;
    proxy_cache_valid 200 1d;
    proxy_pass http://backend;
}
```

## 5.5: User Documentation & Training

### Documentation Created

#### Admin Documentation
- [x] `WHOP_INTEGRATION_README.md` - Integration overview
- [x] `docs/whop-integration-plan.md` - Technical specification
- [x] `docs/whop-integration-status.md` - Implementation status
- [x] `docs/deployment-guide.md` - This file
- [x] `docs/frontend-redesign-guide.md` - UI/UX guide

#### User Guides (To Create)
- [ ] How to connect Whop account
- [ ] How to use AI automations
- [ ] How to send contracts
- [ ] Troubleshooting guide
- [ ] FAQ

### Training Materials

#### Video Tutorials (Planned)
1. **Whop Integration Setup** (5 min)
   - Obtaining Whop API credentials
   - Connecting Whop account
   - Initial data sync

2. **AI Automation Features** (8 min)
   - Lead scoring
   - Email drafting
   - Sentiment analysis
   - Custom workflows

3. **Contract Signing Workflow** (6 min)
   - Creating templates
   - Sending contracts
   - Tracking signatures

#### Quick Start Guide
```markdown
# Quick Start

## 1. Connect Whop
1. Go to Settings → Integrations
2. Find Whop and click "Connect"
3. Authorize on Whop.com
4. Wait for initial sync

## 2. Use AI Features
1. Open any contact or opportunity
2. Click "AI Actions" button
3. Choose: Score Lead, Draft Email, or Summarize

## 3. Send Contracts
1. Create contract template
2. Go to opportunity
3. Click "Send Contract"
4. Select signers and send
```

## Post-Deployment Checklist

### Week 1
- [ ] Monitor error rates
- [ ] Check webhook delivery success
- [ ] Verify data sync accuracy
- [ ] Review AI token usage
- [ ] Check contract signing flow

### Week 2
- [ ] Gather user feedback
- [ ] Identify pain points
- [ ] Fix critical bugs
- [ ] Optimize slow queries
- [ ] Update documentation

### Week 3
- [ ] Implement quick wins from feedback
- [ ] Add missing features
- [ ] Improve error messages
- [ ] Enhance monitoring

### Month 2
- [ ] Evaluate ROI
- [ ] Plan next iteration
- [ ] Add advanced features
- [ ] Scale infrastructure if needed

## Success Metrics

### Technical Metrics
- Uptime: > 99.9%
- API response time: < 200ms (p95)
- Sync accuracy: > 99.5%
- Error rate: < 0.1%

### Business Metrics
- Whop accounts connected: Target 100
- AI operations per day: Target 500
- Contracts sent per month: Target 50
- User satisfaction: > 4.5/5

## Support & Maintenance

### On-Call Rotation
- Primary: DevOps engineer
- Secondary: Backend developer
- Escalation: Tech lead

### Incident Response
1. Acknowledge within 15 minutes
2. Initial assessment within 30 minutes
3. Resolution or workaround within 4 hours
4. Post-mortem within 48 hours

### Regular Maintenance
- Weekly: Review logs and metrics
- Bi-weekly: Dependency updates
- Monthly: Security patches
- Quarterly: Performance optimization

---

**Deployment Status**: Ready for staging
**Next Steps**:
1. Deploy to staging environment
2. Run smoke tests
3. Get stakeholder approval
4. Schedule production deployment
