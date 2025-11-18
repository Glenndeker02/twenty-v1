# TwentyCRM Development Rules

This document contains the essential development rules and patterns for working with the TwentyCRM codebase during the Whop Integration & Enhancements project.

## Core Development Principles

### 1. Code Style Standards
- ✅ **Functional components only** - No class components
- ✅ **Named exports only** - No default exports
- ✅ **Types over interfaces** - Except when extending third-party interfaces
- ✅ **String literals over enums** - Except for GraphQL enums
- ✅ **No 'any' type allowed** - Always provide proper typing
- ✅ **Event handlers over useEffect** - Prefer event handlers for state updates

### 2. Architecture Patterns

#### Frontend (packages/twenty-front/)
```
Entry Point: src/index.tsx
Routing: src/modules/navigation/
State: src/modules/*/states/ (Recoil atoms/selectors)
API: src/modules/*/hooks/useGraphQL*()
Components: src/modules/*/components/
```

**Key Patterns:**
- Use Recoil for global state management
- Use Apollo Client for GraphQL operations
- Use Emotion styled components for styling
- Follow module-based organization (56+ feature modules)
- Place components in their own directories with tests and stories

**State Management Example:**
```typescript
// Define atom
export const whopConnectionState = atom<WhopConnection | null>({
  key: 'whopConnectionState',
  default: null,
});

// Use in component
const [whopConnection, setWhopConnection] = useRecoilState(whopConnectionState);
```

**GraphQL Pattern:**
```typescript
// Use generated hooks
const [createWhopConnection] = useCreateWhopConnectionMutation();
const { data } = useGetWhopConnectionQuery();
```

#### Backend (packages/twenty-server/)
```
Modules: src/modules/*/ (feature modules)
Core: src/engine/core-modules/ (auth, user, workspace, etc.)
Metadata: src/engine/metadata-modules/ (custom objects/fields)
Database: src/engine/core-modules/core-engine.datasource.ts
```

**Module Structure:**
```
src/modules/whop/
├── whop.module.ts (NestJS module)
├── services/
│   ├── whop-api-client.service.ts
│   └── whop-sync.service.ts
├── jobs/
│   └── whop-sync.job.ts
├── whop.resolver.ts (GraphQL)
└── whop.controller.ts (REST if needed)
```

**NestJS Patterns:**
- Use dependency injection with `@Injectable()`
- Follow module-based organization
- Use guards for authentication (`@UseGuards(JwtAuthGuard)`)
- Workspace isolation is automatic via middleware

### 3. Database & ORM

**Entity Pattern (TypeORM):**
```typescript
@Entity({ name: 'whopConnection', schema: 'core' })
@WorkspaceEntity({
  standardId: '@standard/whop-connection',
  namePlural: 'whopConnections',
  labelSingular: 'Whop Connection',
  labelPlural: 'Whop Connections',
})
export class WhopConnectionWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({ standardId: '@standard/access-token' })
  accessToken: string;

  @WorkspaceField({ standardId: '@standard/refresh-token' })
  refreshToken: string;
}
```

**Migration Pattern:**
```bash
npx nx run twenty-server:typeorm migration:generate src/database/typeorm/core/migrations/common/add-whop-connection -d src/database/typeorm/core/core.datasource.ts
```

### 4. GraphQL API Patterns

**Resolver Pattern:**
```typescript
@Resolver()
export class WhopResolver {
  @Mutation(() => WhopConnection)
  @UseGuards(JwtAuthGuard)
  async connectWhopAccount(
    @Args('input') input: ConnectWhopAccountInput,
    @AuthWorkspace() workspace: Workspace,
  ): Promise<WhopConnection> {
    return this.whopService.connect(input, workspace.id);
  }
}
```

**Schema Pattern:**
- Use code-first approach with decorators
- Input types for mutations
- Object types for queries
- Use `@WorkspaceQueryRunner()` for metadata queries

### 5. Integration Patterns

**OAuth Integration:**
1. Create strategy in `src/engine/core-modules/auth/strategies/`
2. Extend `PassportStrategy` and implement `validate()`
3. Store tokens in `connectedAccount` entity
4. Implement token refresh mechanism

**Webhook Pattern:**
1. Create controller in `src/engine/core-modules/webhook/`
2. Implement signature verification
3. Queue background jobs for processing
4. Add audit logging

**Background Jobs (BullMQ):**
```typescript
@Processor('whop-sync')
export class WhopSyncJob {
  @Process('sync-data')
  async syncData(job: Job<WhopSyncJobData>) {
    // Process sync
  }
}
```

### 6. Workflow System Integration

**Workflow Action Pattern:**
```typescript
// Location: src/modules/workflow/workflow-action-runner/
{
  type: 'WHOP_ACTION',
  input: { ... },
  output: { ... }
}
```

**Workflow Trigger Pattern:**
- Use event emitter for triggers
- Create listeners in workflow module
- Support both automatic and manual triggers

### 7. Testing Standards

**Unit Tests:**
```typescript
// Pattern: *.spec.ts
describe('WhopApiClientService', () => {
  it('should fetch whop user data', async () => {
    // Test implementation
  });
});
```

**Integration Tests:**
```bash
npx nx run twenty-server:test:integration:with-db-reset
```

**E2E Tests:**
```typescript
// packages/twenty-e2e-testing/
// Use Playwright for end-to-end tests
```

### 8. Environment Variables

**Pattern:**
```bash
# Backend (.env)
WHOP_CLIENT_ID=your_client_id
WHOP_CLIENT_SECRET=your_client_secret
WHOP_WEBHOOK_SECRET=your_webhook_secret

# Add to .env.example with placeholders
```

### 9. File Naming Conventions

- **Components**: PascalCase (e.g., `WhopConnectionSettings.tsx`)
- **Services**: kebab-case + suffix (e.g., `whop-api-client.service.ts`)
- **Types**: PascalCase (e.g., `WhopConnection.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useWhopConnection.ts`)
- **Tests**: same as source + `.spec.ts` (e.g., `whop-sync.service.spec.ts`)

### 10. Import Patterns

**Use Nx path mapping:**
```typescript
// Good
import { WhopService } from '@/modules/whop/services/whop.service';

// Avoid
import { WhopService } from '../../../modules/whop/services/whop.service';
```

### 11. Error Handling

**Backend:**
```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

throw new NotFoundException('Whop connection not found');
```

**Frontend:**
```typescript
// Use error boundaries and toast notifications
import { useSnackBar } from '@/ui/feedback/snack-bar-manager';

const { enqueueSnackBar } = useSnackBar();
enqueueSnackBar('Failed to connect Whop account', { variant: 'error' });
```

### 12. Security Best Practices

- ✅ **Always validate input** - Use DTOs and validation pipes
- ✅ **Never expose secrets** - Use environment variables
- ✅ **Workspace isolation** - Automatic via middleware, but verify
- ✅ **Token encryption** - Encrypt sensitive data at rest
- ✅ **Rate limiting** - Implement for external API calls
- ✅ **Webhook verification** - Always verify signatures

### 13. Code Quality Commands

**Before Committing:**
```bash
# Lint
npx nx lint twenty-front --fix
npx nx lint twenty-server --fix

# Type check
npx nx typecheck twenty-front
npx nx typecheck twenty-server

# Run tests
npx nx test twenty-front
npx nx test twenty-server

# Format
npx nx fmt twenty-front
npx nx fmt twenty-server
```

### 14. Git Commit Standards

**Pattern:**
```
type(scope): brief description

- Detailed bullet point 1
- Detailed bullet point 2
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding tests
- `docs`: Documentation
- `chore`: Maintenance

**Example:**
```
feat(whop): add OAuth integration for Whop platform

- Implement OAuth strategy with token storage
- Add Whop API client service
- Create connection management UI
```

### 15. Documentation Requirements

**Code Documentation:**
- Add JSDoc comments for public APIs
- Document complex business logic
- Add inline comments for non-obvious code

**User Documentation:**
- Update changes.md for all modifications
- Create setup guides for new features
- Document environment variables

### 16. Performance Guidelines

- ✅ **Lazy load** - Use dynamic imports for large components
- ✅ **Memoization** - Use React.memo, useMemo, useCallback appropriately
- ✅ **Pagination** - Always paginate lists
- ✅ **Debouncing** - Debounce search and API calls
- ✅ **Caching** - Use Apollo cache and Redis appropriately

### 17. Accessibility Standards

- ✅ **WCAG 2.1 AA** - Follow accessibility guidelines
- ✅ **Semantic HTML** - Use proper HTML elements
- ✅ **Keyboard navigation** - Ensure all interactive elements are keyboard accessible
- ✅ **ARIA labels** - Add proper ARIA attributes
- ✅ **Color contrast** - Ensure sufficient contrast ratios

### 18. Project-Specific Rules

**Whop Integration:**
- Store all Whop-related code in `src/modules/whop/` (backend)
- Use `connectedAccount` entity for OAuth tokens
- Follow existing calendar integration patterns
- Prefix all Whop fields with `whop` (e.g., `whopMemberId`)

**AI Automations:**
- Store AI services in `src/modules/ai/`
- Create workflow actions in `src/modules/workflow/workflow-action-runner/`
- Track token usage for cost monitoring
- Always allow user prompt template customization

**Contract Signing:**
- Store contracts in `src/modules/contract/`
- Create standard object for contracts
- Integrate with workflow system for automation
- Store signed documents securely (S3/local with encryption)

**Frontend Redesign:**
- Extend twenty-ui components, don't replace
- Maintain backward compatibility
- Test across browsers (Chrome, Firefox, Safari)
- Ensure mobile responsiveness

### 19. Reference Before Starting Tasks

**Always check:**
1. ✅ This rules.md file
2. ✅ The project plan in the conversation
3. ✅ CLAUDE.md for project commands
4. ✅ Existing similar implementations in codebase
5. ✅ changes.md to avoid conflicts

**Pattern to follow:**
```
1. Read rules.md
2. Review task in plan
3. Find similar implementation in codebase
4. Implement following patterns
5. Test with quality commands
6. Update changes.md
7. Commit with proper message
```

### 20. Common Pitfalls to Avoid

- ❌ Don't use default exports
- ❌ Don't use class components
- ❌ Don't use `any` type
- ❌ Don't skip workspace isolation checks
- ❌ Don't commit without linting/testing
- ❌ Don't expose environment secrets
- ❌ Don't break existing functionality
- ❌ Don't skip error handling
- ❌ Don't forget to update GraphQL schema
- ❌ Don't mix REST and GraphQL unnecessarily

---

## Quick Reference

**Start Development:**
```bash
yarn start  # Starts frontend + backend + worker
```

**Create Migration:**
```bash
npx nx run twenty-server:typeorm migration:generate src/database/typeorm/core/migrations/common/[name] -d src/database/typeorm/core/core.datasource.ts
```

**Generate GraphQL Types:**
```bash
npx nx run twenty-front:graphql:generate
```

**Run Tests:**
```bash
npx nx test [package-name]
npx nx run twenty-server:test:integration:with-db-reset
```

**Lint & Format:**
```bash
npx nx lint [package-name] --fix
npx nx fmt [package-name]
```

---

**Last Updated:** 2025-11-16
**Project:** TwentyCRM × Whop Integration & Enhancements
