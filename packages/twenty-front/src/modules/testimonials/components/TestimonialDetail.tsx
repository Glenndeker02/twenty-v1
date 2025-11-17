import styled from '@emotion/styled';
import { Avatar, Button, IconEdit, IconTrash } from 'twenty-ui';
import { useState } from 'react';
import { TestimonialRatingDisplay } from '@/testimonials/components/TestimonialRatingDisplay';
import { TestimonialStatusBadge } from '@/testimonials/components/TestimonialStatusBadge';
import { TestimonialActionButtons } from '@/testimonials/components/TestimonialActionButtons';
import { TestimonialForm } from '@/testimonials/components/TestimonialForm';
import { useDeleteTestimonial } from '@/testimonials/hooks/useDeleteTestimonial';
import { type Testimonial } from '@/testimonials/types/Testimonial';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.border.radius.md};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StyledCustomerSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledCustomerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledCustomerName = styled.h2`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledCustomerRole = styled.div`
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledContent = styled.div`
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.font.color.secondary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const StyledMetadata = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
`;

const StyledMetadataRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.font.size.sm};
`;

const StyledMetadataLabel = styled.span`
  color: ${({ theme }) => theme.font.color.tertiary};
  min-width: 120px;
`;

const StyledMetadataValue = styled.span`
  color: ${({ theme }) => theme.font.color.secondary};
`;

type TestimonialDetailProps = {
  testimonial: Testimonial;
  onUpdate?: () => void;
  onDelete?: () => void;
};

export const TestimonialDetail = ({
  testimonial,
  onUpdate,
  onDelete,
}: TestimonialDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteTestimonial, loading: deleting } = useDeleteTestimonial();

  const handleDelete = async () => {
    if (
      window.confirm('Are you sure you want to delete this testimonial?')
    ) {
      await deleteTestimonial(testimonial.id);
      onDelete?.();
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    onUpdate?.();
  };

  if (isEditing) {
    return (
      <TestimonialForm
        testimonial={testimonial}
        onSuccess={handleUpdateSuccess}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledCustomerSection>
          <Avatar
            avatarUrl={testimonial.avatarUrl}
            placeholder={testimonial.customerName}
            size="xl"
            type="rounded"
          />
          <StyledCustomerInfo>
            <StyledCustomerName>
              {testimonial.customerName}
            </StyledCustomerName>
            {testimonial.customerRole && (
              <StyledCustomerRole>
                {testimonial.customerRole}
              </StyledCustomerRole>
            )}
          </StyledCustomerInfo>
        </StyledCustomerSection>

        <StyledActions>
          <TestimonialActionButtons
            testimonial={testimonial}
            onApproved={onUpdate}
            onRejected={onUpdate}
          />
          <Button
            Icon={IconEdit}
            variant="secondary"
            onClick={() => setIsEditing(true)}
          />
          <Button
            Icon={IconTrash}
            variant="secondary"
            accent="danger"
            onClick={handleDelete}
            disabled={deleting}
          />
        </StyledActions>
      </StyledHeader>

      <TestimonialRatingDisplay rating={testimonial.rating} />

      <StyledContent>{testimonial.content}</StyledContent>

      <StyledMetadata>
        <StyledMetadataRow>
          <StyledMetadataLabel>Status:</StyledMetadataLabel>
          <StyledMetadataValue>
            <TestimonialStatusBadge status={testimonial.status} />
          </StyledMetadataValue>
        </StyledMetadataRow>

        <StyledMetadataRow>
          <StyledMetadataLabel>Submitted:</StyledMetadataLabel>
          <StyledMetadataValue>
            {new Date(testimonial.submittedAt).toLocaleString()}
          </StyledMetadataValue>
        </StyledMetadataRow>

        {testimonial.approvedBy && (
          <StyledMetadataRow>
            <StyledMetadataLabel>Approved By:</StyledMetadataLabel>
            <StyledMetadataValue>
              {testimonial.approvedBy.name}
            </StyledMetadataValue>
          </StyledMetadataRow>
        )}

        <StyledMetadataRow>
          <StyledMetadataLabel>Created:</StyledMetadataLabel>
          <StyledMetadataValue>
            {new Date(testimonial.createdAt).toLocaleString()}
          </StyledMetadataValue>
        </StyledMetadataRow>

        <StyledMetadataRow>
          <StyledMetadataLabel>Last Updated:</StyledMetadataLabel>
          <StyledMetadataValue>
            {new Date(testimonial.updatedAt).toLocaleString()}
          </StyledMetadataValue>
        </StyledMetadataRow>
      </StyledMetadata>
    </StyledContainer>
  );
};
