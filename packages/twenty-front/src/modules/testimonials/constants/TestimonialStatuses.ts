export const TESTIMONIAL_STATUSES = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export const TESTIMONIAL_STATUS_COLORS = {
  DRAFT: 'gray',
  PENDING: 'yellow',
  APPROVED: 'green',
  REJECTED: 'red',
} as const;

export const TESTIMONIAL_STATUS_LABELS = {
  DRAFT: 'Draft',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
} as const;
