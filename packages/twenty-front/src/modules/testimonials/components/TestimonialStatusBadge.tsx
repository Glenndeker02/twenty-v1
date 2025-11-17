import { Tag } from 'twenty-ui';
import { TESTIMONIAL_STATUS_COLORS, TESTIMONIAL_STATUS_LABELS } from '@/testimonials/constants/TestimonialStatuses';
import { type TestimonialStatus } from '@/testimonials/types/Testimonial';

export const TestimonialStatusBadge = ({ status }: { status: TestimonialStatus | null }) => {
  if (!status) return null;

  return (
    <Tag
      color={TESTIMONIAL_STATUS_COLORS[status]}
      text={TESTIMONIAL_STATUS_LABELS[status]}
    />
  );
};
