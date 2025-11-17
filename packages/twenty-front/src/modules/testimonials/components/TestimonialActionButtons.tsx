import styled from '@emotion/styled';
import { Button, IconCheck, IconX } from 'twenty-ui';
import { useApproveTestimonial } from '@/testimonials/hooks/useApproveTestimonial';
import { useRejectTestimonial } from '@/testimonials/hooks/useRejectTestimonial';
import { type Testimonial } from '@/testimonials/types/Testimonial';

const StyledButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

type TestimonialActionButtonsProps = {
  testimonial: Testimonial;
  onApproved?: () => void;
  onRejected?: () => void;
};

export const TestimonialActionButtons = ({
  testimonial,
  onApproved,
  onRejected,
}: TestimonialActionButtonsProps) => {
  const { approveTestimonial, loading: approving } = useApproveTestimonial();
  const { rejectTestimonial, loading: rejecting } = useRejectTestimonial();

  const handleApprove = async () => {
    await approveTestimonial(testimonial.id);
    onApproved?.();
  };

  const handleReject = async () => {
    await rejectTestimonial(testimonial.id);
    onRejected?.();
  };

  // Only show buttons if testimonial is PENDING or DRAFT
  const canApproveOrReject =
    testimonial.status === 'PENDING' || testimonial.status === 'DRAFT';

  if (!canApproveOrReject) {
    return null;
  }

  return (
    <StyledButtonGroup>
      <Button
        Icon={IconCheck}
        title="Approve"
        variant="primary"
        accent="positive"
        onClick={handleApprove}
        disabled={approving || rejecting}
      />
      <Button
        Icon={IconX}
        title="Reject"
        variant="secondary"
        accent="danger"
        onClick={handleReject}
        disabled={approving || rejecting}
      />
    </StyledButtonGroup>
  );
};
