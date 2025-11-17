# Testimonials Module

Complete testimonial management system for Twenty CRM with internal UI, approval workflows, and public submission capabilities.

## Features

✅ **Complete CRUD Operations**
- Create, read, update, delete testimonials
- Approve/reject workflow (DRAFT → PENDING → APPROVED/REJECTED)
- 5-star rating system
- Customer name, role, avatar
- Rich testimonial content

✅ **Internal UI Components**
- Testimonial list view with filters
- Testimonial detail view
- Create/edit forms
- Status badges
- Rating display
- Action buttons (approve/reject/edit/delete)

✅ **Polymorphic Relations**
- Link testimonials to Companies
- Link testimonials to People
- Link testimonials to Opportunities
- Automatic support for custom objects

## Usage

### Display Testimonial List

```tsx
import { TestimonialList } from '@/testimonials/components';

function TestimonialsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <TestimonialList
      onCreateClick={() => setShowForm(true)}
    />
  );
}
```

### Create Testimonial Form

```tsx
import { TestimonialForm } from '@/testimonials/components';

function CreateTestimonialDialog() {
  const handleSuccess = () => {
    console.log('Testimonial created!');
  };

  return (
    <TestimonialForm
      onSuccess={handleSuccess}
      onCancel={() => setShowForm(false)}
    />
  );
}
```

### Display Testimonials on Record Pages

```tsx
import { TestimonialsCard } from '@/testimonials/components';

// On Company detail page
function CompanyDetailPage({ companyId }: { companyId: string }) {
  return (
    <div>
      {/* Other company details */}

      <TestimonialsCard
        recordId={companyId}
        recordType="company"
        onViewAll={() => navigate('/testimonials')}
      />
    </div>
  );
}
```

### Filter Testimonials

```tsx
import { TestimonialList, TestimonialFilters } from '@/testimonials/components';
import { useState } from 'react';

function FilteredTestimonials() {
  const [statusFilter, setStatusFilter] = useState(['APPROVED']);
  const [minRating, setMinRating] = useState(4);

  return (
    <>
      <TestimonialFilters
        selectedStatus={statusFilter}
        minRating={minRating}
        onStatusChange={setStatusFilter}
        onMinRatingChange={setMinRating}
      />

      <TestimonialList
        statusFilter={statusFilter}
        minRating={minRating}
      />
    </>
  );
}
```

### Approve/Reject Testimonials

```tsx
import { TestimonialActionButtons } from '@/testimonials/components';

function TestimonialReview({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div>
      <h3>{testimonial.customerName}</h3>
      <p>{testimonial.content}</p>

      <TestimonialActionButtons
        testimonial={testimonial}
        onApproved={() => console.log('Approved!')}
        onRejected={() => console.log('Rejected!')}
      />
    </div>
  );
}
```

### Use Hooks Directly

```tsx
import {
  useTestimonials,
  useCreateTestimonial,
  useApproveTestimonial,
} from '@/testimonials/hooks';

function CustomTestimonialPage() {
  // Fetch testimonials
  const { testimonials, loading } = useTestimonials({
    filter: { status: { eq: 'PENDING' } },
    orderBy: { submittedAt: 'DescNullsLast' },
  });

  // Create testimonial
  const { createTestimonial } = useCreateTestimonial();

  const handleCreate = async () => {
    await createTestimonial({
      customerName: 'John Doe',
      content: 'Great product!',
      rating: 5,
      status: 'DRAFT',
      submittedAt: new Date().toISOString(),
    });
  };

  // Approve testimonial
  const { approveTestimonial } = useApproveTestimonial();

  const handleApprove = async (id: string) => {
    await approveTestimonial(id);
  };

  return <div>{/* Your custom UI */}</div>;
}
```

## Components

### Display Components

- **`TestimonialCard`** - Reusable card showing single testimonial
- **`TestimonialRatingDisplay`** - Star rating (1-5 stars)
- **`TestimonialStatusBadge`** - Color-coded status badge

### List & Management

- **`TestimonialList`** - Grid of testimonials with filters
- **`TestimonialFilters`** - Filter by status and rating
- **`TestimonialDetail`** - Full testimonial view with metadata
- **`TestimonialsCard`** - Compact card for record detail pages

### Forms & Actions

- **`TestimonialForm`** - Create/edit form with validation
- **`TestimonialActionButtons`** - Approve/Reject buttons

## Hooks

### CRUD Hooks

- **`useTestimonials(options)`** - Fetch testimonials
  - `filter?: RecordGqlOperationFilter`
  - `orderBy?: any`
  - `skip?: boolean`
  - Returns: `{ testimonials, loading, fetchMore }`

- **`useCreateTestimonial()`** - Create testimonial
  - Returns: `{ createTestimonial, loading }`

- **`useUpdateTestimonial()`** - Update testimonial
  - Returns: `{ updateTestimonial, loading }`

- **`useDeleteTestimonial()`** - Delete testimonial
  - Returns: `{ deleteTestimonial, loading }`

### Workflow Hooks

- **`useApproveTestimonial()`** - Approve testimonial
  - Returns: `{ approveTestimonial, loading }`
  - Sets status to 'APPROVED'

- **`useRejectTestimonial()`** - Reject testimonial
  - Returns: `{ rejectTestimonial, loading }`
  - Sets status to 'REJECTED'

## Status Workflow

1. **DRAFT** - Created internally, not yet submitted
2. **PENDING** - Submitted and awaiting review
3. **APPROVED** - Reviewed and approved for public display
4. **REJECTED** - Reviewed and declined

## Integration Points

### Company Detail Page

Add `TestimonialsCard` to Company detail pages to show company testimonials.

### Person Detail Page

Add `TestimonialsCard` to Person detail pages to show testimonials from that person.

### Opportunity Detail Page

Add `TestimonialsCard` to Opportunity detail pages to show related testimonials.

## Styling

All components use Twenty's design system (Emotion + styled-components) and will automatically match your theme.

## Backend Requirements

Ensure the backend schema is synced:

```bash
npx nx database:reset twenty-server
npx nx run twenty-server:command workspace:sync-metadata
```

## Next Features (Not Yet Implemented)

- 🚧 Public submission form
- 🚧 Email request system
- 🚧 Public display page
- 🚧 Embeddable widget
- 🚧 Export to JSON/CSV

See `TESTIMONIAL_FEATURES_IMPLEMENTED.md` for full implementation status.
