# Testimonial Management System - Implementation Guide

## Overview

This document provides a comprehensive guide for the testimonial management system implementation in Twenty CRM. The backend schema is **complete and production-ready**, while the frontend requires additional implementation.

---

## ✅ Completed: Backend Schema (Production-Ready)

### Database Entities

#### **1. Testimonial Entity**
**Location:** `packages/twenty-server/src/modules/testimonial/standard-objects/testimonial.workspace-entity.ts`

**Fields:**
- `id` (UUID) - Primary key
- `position` (NUMBER) - For ordering
- `customerName` (TEXT, required) - Customer providing testimonial
- `customerRole` (TEXT, optional) - Role/company (e.g., "CEO at Acme Corp")
- `content` (TEXT, required) - Testimonial message
- `rating` (NUMBER, 1-5) - Star rating
- `avatarUrl` (TEXT, optional) - Customer photo URL
- `submittedAt` (DATETIME) - Submission timestamp
- `status` (SELECT) - Workflow state: `DRAFT`, `PENDING`, `APPROVED`, `REJECTED`
- `createdBy` (ACTOR) - Who created the record
- `approvedBy` (RELATION → WorkspaceMember) - Who approved it
- `testimonialTargets` (ONE-TO-MANY → TestimonialTarget) - Links to CRM records
- `timelineActivities` (ONE-TO-MANY) - Change history
- `favorites` (ONE-TO-MANY) - Favoriting support

#### **2. TestimonialTarget Entity (Junction Table)**
**Location:** `packages/twenty-server/src/modules/testimonial/standard-objects/testimonial-target.workspace-entity.ts`

**Purpose:** Enables polymorphic relationships (testimonials linked to multiple record types)

**Foreign Keys:**
- `testimonialId` → Testimonial
- `personId` → Person (nullable)
- `companyId` → Company (nullable)
- `opportunityId` → Opportunity (nullable)
- Dynamic foreign keys for custom objects

**Pattern:** Only ONE foreign key is populated per record (exclusive OR)

### Standard Configuration

#### **Standard Object IDs**
**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids.ts`

```typescript
testimonial: '20202020-8c4f-4d5e-9a1b-2e3f4a5b6c7d',
testimonialTarget: '20202020-9d5e-4e6f-9b2c-3f4a5b6c7d8e',
```

#### **Standard Field IDs**
**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids.ts`

All testimonial and testimonialTarget field IDs are defined.

#### **Standard Icons**
**File:** `packages/twenty-server/src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons.ts`

```typescript
testimonial: 'IconStar',
testimonialTarget: 'IconTarget',
```

### Updated Entities

The following entities now have `testimonialTargets` relations:

1. **Company** - `packages/twenty-server/src/modules/company/standard-objects/company.workspace-entity.ts`
2. **Person** - `packages/twenty-server/src/modules/person/standard-objects/person.workspace-entity.ts`
3. **Opportunity** - `packages/twenty-server/src/modules/opportunity/standard-objects/opportunity.workspace-entity.ts`
4. **CustomWorkspaceEntity** - All custom objects automatically support testimonials

---

## ✅ Completed: Frontend Foundation

### TypeScript Types

**Location:** `packages/twenty-front/src/modules/testimonials/types/`

#### **Testimonial.ts**
```typescript
export type TestimonialStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type Testimonial = {
  id: string;
  customerName: string;
  customerRole: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
  submittedAt: string;
  status: TestimonialStatus | null;
  approvedBy?: WorkspaceMember | null;
  testimonialTargets?: TestimonialTarget[];
  // ... standard fields
};
```

#### **TestimonialTarget.ts**
```typescript
export type TestimonialTarget = {
  id: string;
  testimonialId?: string | null;
  personId?: string | null;
  companyId?: string | null;
  opportunityId?: string | null;
  testimonial?: Testimonial;
  person?: Person | null;
  company?: Company | null;
  opportunity?: Opportunity | null;
  [key: string]: any; // Custom objects
};
```

### Constants

**Location:** `packages/twenty-front/src/modules/testimonials/constants/TestimonialStatuses.ts`

```typescript
export const TESTIMONIAL_STATUSES = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const TESTIMONIAL_STATUS_COLORS = {
  DRAFT: 'gray',
  PENDING: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
};
```

### Core Metadata

**File:** `packages/twenty-front/src/modules/object-metadata/types/CoreObjectNameSingular.ts`

Added:
```typescript
Testimonial = 'testimonial',
TestimonialTarget = 'testimonialTarget',
```

---

## 🚧 To Implement: Frontend UI & Features

### Phase 1: GraphQL Operations

#### **Create GraphQL Fragments**
**Location:** `packages/twenty-front/src/modules/testimonials/graphql/fragments/`

**Files to create:**
- `TestimonialFragment.ts` - Core testimonial fields
- `TestimonialTargetFragment.ts` - Target relation fields

**Example:**
```typescript
import { gql } from '@apollo/client';

export const TESTIMONIAL_FRAGMENT = gql`
  fragment TestimonialFragment on Testimonial {
    id
    createdAt
    updatedAt
    position
    customerName
    customerRole
    content
    rating
    avatarUrl
    submittedAt
    status
    approvedBy {
      id
      name
      avatarUrl
    }
    __typename
  }
`;
```

#### **Create Query Operations**
**Location:** `packages/twenty-front/src/modules/testimonials/graphql/queries/`

**Files to create:**
- `findManyTestimonials.ts`
- `findOneTestimonial.ts`
- `findTestimonialTargets.ts`

#### **Create Mutation Operations**
**Location:** `packages/twenty-front/src/modules/testimonials/graphql/mutations/`

**Files to create:**
- `createTestimonial.ts`
- `updateTestimonial.ts`
- `deleteTestimonial.ts`
- `createTestimonialTargets.ts`
- `updateTestimonialStatus.ts` - Helper for approval workflow

---

### Phase 2: React Hooks

#### **CRUD Hooks**
**Location:** `packages/twenty-front/src/modules/testimonials/hooks/`

**Files to create:**

1. **useTestimonials.ts** - Fetch testimonials with filters
```typescript
export const useTestimonials = ({
  status,
  minRating,
  targetableObjects,
}: UseTestimonialsParams) => {
  // Implementation following useActivities pattern
};
```

2. **useCreateTestimonial.ts** - Create testimonial with targets
3. **useUpdateTestimonial.ts** - Update testimonial
4. **useDeleteTestimonial.ts** - Delete testimonial
5. **useApproveTestimonial.ts** - Approve testimonial (sets status to APPROVED)
6. **useRejectTestimonial.ts** - Reject testimonial (sets status to REJECTED)

---

### Phase 3: Internal CRM UI Components

#### **Testimonial List View**
**Location:** `packages/twenty-front/src/modules/testimonials/components/`

**Components to create:**

1. **TestimonialList.tsx** - Main list component
   - Displays testimonials in grid or list
   - Status badges with colors
   - Star rating display
   - Linked records chips
   - Sort by date, rating, status
   - Filter controls

2. **TestimonialListItem.tsx** - Individual testimonial card
   - Customer name and avatar
   - Rating stars
   - Testimonial content (truncated)
   - Status badge
   - Quick actions (approve, reject, edit, delete)
   - Linked record chips

3. **TestimonialFilters.tsx** - Filter panel
   - Status filter (multi-select)
   - Rating filter (min rating)
   - Date range filter
   - Linked record filter

#### **Testimonial Detail View**
**Location:** `packages/twenty-front/src/modules/testimonials/components/`

**Components to create:**

4. **TestimonialDetail.tsx** - Full testimonial view
   - All testimonial fields
   - Approval workflow buttons
   - Timeline activities
   - Edit mode
   - Delete confirmation

5. **TestimonialForm.tsx** - Create/edit form
   - Customer name input (required)
   - Customer role input
   - Content textarea (required)
   - Rating selector (1-5 stars)
   - Avatar URL input
   - Status selector (for internal users)
   - Target record selector (multi-select: companies, people, opportunities)
   - Validation

6. **TestimonialStatusBadge.tsx** - Status display
   - Color-coded badges
   - Icons for each status

7. **TestimonialRatingDisplay.tsx** - Star rating component
   - Visual star display
   - Editable rating selector

#### **Record Detail Page Integration**
**Location:** Integration into existing record detail pages

**Components to create:**

8. **TestimonialsCard.tsx** - Card for Company/Person/Opportunity detail pages
   - Shows testimonials linked to current record
   - "Add Testimonial" button
   - "Request Testimonial" button
   - List of recent testimonials
   - Link to full testimonials list

**Files to modify:**
- Company detail page - Add TestimonialsCard
- Person detail page - Add TestimonialsCard
- Opportunity detail page - Add TestimonialsCard

---

### Phase 4: Public Submission Form

#### **Public API Endpoint**
**Location:** `packages/twenty-server/src/modules/testimonial/`

**Files to create:**

1. **testimonial.controller.ts** - Public REST controller
```typescript
@Controller('public/testimonials')
export class PublicTestimonialController {
  @Post('submit')
  async submitTestimonial(
    @Body() dto: SubmitTestimonialDto,
    @Query('workspaceId') workspaceId: string,
  ) {
    // Create testimonial with PENDING status
    // Validate input
    // Optional: Send email notification to workspace admins
  }
}
```

2. **dto/submit-testimonial.dto.ts** - Input validation
```typescript
export class SubmitTestimonialDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsOptional()
  customerRole?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  email?: string; // For follow-up

  // Optional: reCAPTCHA token
  @IsString()
  @IsOptional()
  recaptchaToken?: string;
}
```

#### **Public Submission Page**
**Location:** `packages/twenty-front/src/pages/public/testimonials/`

**Components to create:**

1. **SubmitTestimonial.tsx** - Public submission form page
   - Clean, public-facing design
   - No authentication required
   - Fields:
     - Name (required)
     - Role/Company (optional)
     - Testimonial message (required, textarea)
     - Rating (1-5 stars, required)
     - Email (optional)
   - reCAPTCHA integration (recommended)
   - Success message after submission
   - Shareable URL: `/public/testimonials/submit?workspace={workspaceId}`

---

### Phase 5: Email Request System

#### **Backend Email Service**
**Location:** `packages/twenty-server/src/modules/testimonial/services/`

**Files to create:**

1. **testimonial-request-email.service.ts**
```typescript
@Injectable()
export class TestimonialRequestEmailService {
  async sendTestimonialRequest({
    recipientEmail,
    recipientName,
    senderName,
    customMessage,
    submissionUrl,
  }: TestimonialRequestParams) {
    // Send email using existing email service
    // Include personalized message
    // Include link to public submission form with pre-filled data
  }
}
```

2. **testimonial-request.controller.ts** - REST endpoint for sending requests
```typescript
@Post('testimonials/:id/request')
async requestTestimonial(
  @Param('id') testimonialId: string,
  @Body() dto: RequestTestimonialDto,
) {
  // Send email request
  // Track request (optional: create TestimonialRequest entity)
}
```

#### **Email Template**
**Location:** `packages/twenty-emails/src/templates/`

**Files to create:**

1. **testimonial-request.email.tsx** - React Email template
```tsx
export const TestimonialRequestEmail = ({
  recipientName,
  senderName,
  customMessage,
  submissionUrl,
}: TestimonialRequestEmailProps) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading>Share Your Experience</Heading>
          <Text>Hi {recipientName},</Text>
          <Text>{customMessage}</Text>
          <Button href={submissionUrl}>
            Submit Testimonial
          </Button>
        </Container>
      </Body>
    </Html>
  );
};
```

#### **Frontend Request Dialog**
**Location:** `packages/twenty-front/src/modules/testimonials/components/`

**Components to create:**

1. **RequestTestimonialDialog.tsx** - Modal for requesting testimonials
   - Select recipient (from Person records)
   - Custom message field
   - Preview email
   - Send button
   - Confirmation

---

### Phase 6: Public Display Page

#### **Public Display Page**
**Location:** `packages/twenty-front/src/pages/public/testimonials/`

**Components to create:**

1. **TestimonialsDisplay.tsx** - Public testimonial gallery
   - Shows APPROVED testimonials only
   - Responsive grid layout (3 columns desktop, 1 column mobile)
   - Testimonial card with:
     - Customer name and avatar
     - Customer role
     - Star rating
     - Testimonial content
     - Date
   - Filter by minimum rating
   - Pagination (10 per page)
   - No authentication required
   - Shareable URL: `/public/testimonials/display?workspace={workspaceId}`

2. **TestimonialCard.tsx** - Individual testimonial card for display
   - Styled card component
   - Avatar
   - Name and role
   - Stars
   - Quote styling for content

---

### Phase 7: Embeddable Widget

#### **Widget JavaScript**
**Location:** `packages/twenty-server/public/widgets/` (or CDN)

**Files to create:**

1. **testimonials-widget.js** - Standalone JavaScript widget
```javascript
(function() {
  window.TwentyTestimonials = {
    init: function(config) {
      // config: { workspaceId, containerId, maxItems, minRating, theme }
      // Fetch approved testimonials
      // Render in iframe or directly
      // Auto-refresh periodically
    }
  };
})();
```

2. **testimonials-widget.css** - Widget styles
   - Minimal, responsive styles
   - Customizable via config

#### **Widget Embed Generator**
**Location:** `packages/twenty-front/src/modules/testimonials/components/`

**Components to create:**

1. **WidgetEmbedGenerator.tsx** - UI for generating embed code
   - Configuration options:
     - Max items to display
     - Minimum rating filter
     - Theme (light/dark)
     - Colors
   - Generated code output:
```html
<div id="twenty-testimonials"></div>
<script src="https://cdn.twenty.com/widgets/testimonials.js"></script>
<script>
  TwentyTestimonials.init({
    workspaceId: 'YOUR_WORKSPACE_ID',
    containerId: 'twenty-testimonials',
    maxItems: 6,
    minRating: 4,
    theme: 'light'
  });
</script>
```

---

### Phase 8: Export Functionality

#### **Backend Export Service**
**Location:** `packages/twenty-server/src/modules/testimonial/services/`

**Files to create:**

1. **testimonial-export.service.ts**
```typescript
@Injectable()
export class TestimonialExportService {
  async exportToJson(filters: TestimonialFilters): Promise<string> {
    // Fetch testimonials with filters
    // Convert to JSON
    // Return JSON string
  }

  async exportToCsv(filters: TestimonialFilters): Promise<string> {
    // Fetch testimonials with filters
    // Convert to CSV
    // Return CSV string
  }
}
```

2. **testimonial-export.controller.ts** - Export endpoints
```typescript
@Get('testimonials/export/json')
async exportJson(@Query() filters: TestimonialFilters) {
  // Return JSON file
}

@Get('testimonials/export/csv')
async exportCsv(@Query() filters: TestimonialFilters) {
  // Return CSV file
}
```

#### **Frontend Export UI**
**Location:** `packages/twenty-front/src/modules/testimonials/components/`

**Components to create:**

1. **ExportTestimonialsDialog.tsx** - Export options dialog
   - Format selector (JSON/CSV)
   - Filter options:
     - Status filter
     - Date range
     - Minimum rating
   - Export button
   - Download file

---

## 🧪 Testing the Backend

### Step 1: Install Dependencies
```bash
cd /home/user/twenty-v1
yarn install
```

### Step 2: Reset Database
This will create the new `testimonials` and `testimonialTargets` tables:
```bash
npx nx database:reset twenty-server
```

### Step 3: Sync Metadata
```bash
npx nx run twenty-server:command workspace:sync-metadata
```

### Step 4: Start Development Server
```bash
yarn start
```
This starts:
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`
- GraphQL Playground: `http://localhost:3000/graphql`

### Step 5: Test GraphQL API

#### Query All Testimonials
```graphql
query {
  testimonials {
    edges {
      node {
        id
        customerName
        customerRole
        content
        rating
        status
        submittedAt
        testimonialTargets {
          edges {
            node {
              id
              person {
                id
                name
              }
              company {
                id
                name
              }
            }
          }
        }
      }
    }
  }
}
```

#### Create a Testimonial
```graphql
mutation {
  createTestimonial(
    data: {
      customerName: "Jane Smith"
      customerRole: "CTO at TechCorp"
      content: "Twenty CRM transformed how we manage our sales pipeline. Highly recommend!"
      rating: 5
      status: "PENDING"
      submittedAt: "2025-11-17T10:00:00Z"
    }
  ) {
    id
    customerName
    status
    rating
  }
}
```

#### Link Testimonial to Company
```graphql
mutation {
  createTestimonialTarget(
    data: {
      testimonialId: "YOUR_TESTIMONIAL_ID"
      companyId: "YOUR_COMPANY_ID"
    }
  ) {
    id
  }
}
```

#### Approve a Testimonial
```graphql
mutation {
  updateTestimonial(
    id: "YOUR_TESTIMONIAL_ID"
    data: {
      status: "APPROVED"
      approvedById: "YOUR_WORKSPACE_MEMBER_ID"
    }
  ) {
    id
    status
    approvedBy {
      id
      name
    }
  }
}
```

---

## 📁 File Structure Summary

### Backend (Completed ✅)
```
packages/twenty-server/src/
├── engine/
│   ├── twenty-orm/
│   │   └── custom.workspace-entity.ts (✅ Updated)
│   └── workspace-manager/workspace-sync-metadata/constants/
│       ├── standard-field-ids.ts (✅ Updated)
│       ├── standard-object-icons.ts (✅ Updated)
│       └── standard-object-ids.ts (✅ Updated)
└── modules/
    ├── company/standard-objects/
    │   └── company.workspace-entity.ts (✅ Updated)
    ├── person/standard-objects/
    │   └── person.workspace-entity.ts (✅ Updated)
    ├── opportunity/standard-objects/
    │   └── opportunity.workspace-entity.ts (✅ Updated)
    └── testimonial/
        └── standard-objects/
            ├── testimonial.workspace-entity.ts (✅ Created)
            └── testimonial-target.workspace-entity.ts (✅ Created)
```

### Frontend (Partially Complete)
```
packages/twenty-front/src/modules/
├── object-metadata/types/
│   └── CoreObjectNameSingular.ts (✅ Updated)
└── testimonials/
    ├── types/
    │   ├── Testimonial.ts (✅ Created)
    │   └── TestimonialTarget.ts (✅ Created)
    ├── constants/
    │   └── TestimonialStatuses.ts (✅ Created)
    ├── graphql/ (🚧 To implement)
    │   ├── fragments/
    │   ├── queries/
    │   └── mutations/
    ├── hooks/ (🚧 To implement)
    └── components/ (🚧 To implement)
```

---

## 🎯 Implementation Priority

### Phase 1 (Core Functionality)
1. ✅ Backend schema (DONE)
2. ✅ Frontend types (DONE)
3. 🚧 GraphQL operations
4. 🚧 Basic CRUD hooks
5. 🚧 Testimonial list view
6. 🚧 Testimonial form
7. 🚧 Status workflow buttons

### Phase 2 (Public Features)
8. 🚧 Public submission form + API
9. 🚧 Public display page

### Phase 3 (Advanced Features)
10. 🚧 Email request system
11. 🚧 Embeddable widget
12. 🚧 Export functionality

---

## 🔒 Security Considerations

1. **Public Submission Form**
   - Implement rate limiting (e.g., 5 submissions per IP per hour)
   - Add reCAPTCHA v3 for spam protection
   - Sanitize input to prevent XSS
   - Testimonials default to PENDING status for review

2. **Public Display Page**
   - Only show APPROVED testimonials
   - Cache responses (CDN/Redis)
   - Paginate results

3. **Widget**
   - Use iframe for security isolation
   - CORS configuration for API
   - CSP headers

4. **Approval Workflow**
   - Only workspace admins can approve/reject
   - Track who approved each testimonial
   - Timeline activities for audit trail

---

## 📊 Database Schema Diagram

```
┌─────────────────────────────────────┐
│         testimonials                │
├─────────────────────────────────────┤
│ id (PK)                             │
│ position                            │
│ customerName                        │
│ customerRole                        │
│ content                             │
│ rating                              │
│ avatarUrl                           │
│ submittedAt                         │
│ status (DRAFT/PENDING/APPROVED/     │
│         REJECTED)                   │
│ approvedById (FK → workspaceMembers)│
│ createdAt                           │
│ updatedAt                           │
└─────────────────────────────────────┘
              │
              │ 1:N
              ▼
┌─────────────────────────────────────┐
│      testimonialTargets             │
├─────────────────────────────────────┤
│ id (PK)                             │
│ testimonialId (FK → testimonials)   │
│ personId (FK → persons) [nullable]  │
│ companyId (FK → companies) [nullable]│
│ opportunityId (FK → opportunities)  │
│   [nullable]                        │
│ {customObject}Id (dynamic)          │
│ createdAt                           │
│ updatedAt                           │
└─────────────────────────────────────┘
```

**Note:** Only ONE of (personId, companyId, opportunityId, customObjectId) is populated per record.

---

## ✨ Feature Highlights

### For CRM Users (Internal)
- ✅ Create testimonials manually
- ✅ Link testimonials to companies, people, deals
- ✅ Approval workflow (Draft → Pending → Approved/Rejected)
- ✅ Star ratings (1-5)
- ✅ Filter by status, rating, date
- 🚧 Request testimonials via email
- 🚧 Export testimonials (JSON/CSV)

### For Customers (Public)
- 🚧 Submit testimonials via public form
- 🚧 No login required
- 🚧 Star rating selector
- 🚧 Spam protection

### For Website Visitors (Public)
- 🚧 View approved testimonials on public page
- 🚧 Filter by rating
- 🚧 Responsive display
- 🚧 Embed testimonials on any website (widget)

---

## 🚀 Next Steps

1. **Test Backend** (recommended first step)
   - Install dependencies
   - Reset database
   - Test GraphQL queries/mutations
   - Verify testimonial CRUD operations

2. **Implement Frontend**
   - Follow implementation guide above
   - Start with GraphQL operations
   - Build CRUD hooks
   - Create UI components

3. **Add Public Features**
   - Public submission form + API
   - Public display page
   - Widget embed

4. **Polish**
   - Email request system
   - Export functionality
   - Documentation
   - Tests

---

## 📞 Support

This implementation follows Twenty CRM's established patterns:
- Polymorphic relations (same as Notes and Tasks)
- Status workflows (same as Tasks)
- GraphQL API structure
- React component architecture

For questions about Twenty CRM architecture, refer to:
- Twenty Docs: https://docs.twenty.com
- GitHub Issues: https://github.com/twentyhq/twenty/issues
- CLAUDE.md in project root

---

**Generated:** 2025-11-17
**Status:** Backend Complete ✅ | Frontend In Progress 🚧
