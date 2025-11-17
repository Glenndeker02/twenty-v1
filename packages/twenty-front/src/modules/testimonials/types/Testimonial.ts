import { TestimonialTarget } from '@/testimonials/types/TestimonialTarget';
import { WorkspaceMember } from '@/workspace-member/types/WorkspaceMember';

export type TestimonialStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type Testimonial = {
  id: string;
  createdAt: string;
  updatedAt: string;
  position: number;
  customerName: string;
  customerRole: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
  submittedAt: string;
  status: TestimonialStatus | null;
  approvedBy?: Pick<WorkspaceMember, 'id' | 'name' | 'avatarUrl' | 'colorScheme'> | null;
  approvedById?: string | null;
  testimonialTargets?: TestimonialTarget[];
  __typename: 'Testimonial';
};
