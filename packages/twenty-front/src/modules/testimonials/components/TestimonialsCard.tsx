import styled from '@emotion/styled';
import { Button, Card, IconPlus, IconStar } from 'twenty-ui';
import { useState } from 'react';
import { useTestimonials } from '@/testimonials/hooks/useTestimonials';
import { TestimonialRatingDisplay } from '@/testimonials/components/TestimonialRatingDisplay';
import { TestimonialStatusBadge } from '@/testimonials/components/TestimonialStatusBadge';
import { TestimonialForm } from '@/testimonials/components/TestimonialForm';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledTestimonialList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledTestimonialItem = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => theme.background.tertiary};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledTestimonialHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCustomerName = styled.div`
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledContent = styled.div`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.font.color.secondary};
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StyledEmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing(6)};
  text-align: center;
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledViewAll = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.blue};
  font-size: ${({ theme }) => theme.font.size.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing(2)} 0;

  &:hover {
    text-decoration: underline;
  }
`;

type TestimonialsCardProps = {
  recordId: string;
  recordType: 'company' | 'person' | 'opportunity';
  onViewAll?: () => void;
};

export const TestimonialsCard = ({
  recordId,
  recordType,
  onViewAll,
}: TestimonialsCardProps) => {
  const [showForm, setShowForm] = useState(false);

  // Build filter to get testimonials linked to this record
  const filter = {
    testimonialTargets: {
      some: {
        [`${recordType}Id`]: {
          eq: recordId,
        },
      },
    },
  };

  const { testimonials, loading } = useTestimonials({
    filter,
    orderBy: { submittedAt: 'DescNullsLast' },
  });

  // Show only first 3 testimonials
  const displayedTestimonials = testimonials.slice(0, 3);
  const hasMore = testimonials.length > 3;

  if (showForm) {
    return (
      <StyledCard>
        <StyledHeader>
          <StyledTitle>
            <IconStar size={16} />
            Add Testimonial
          </StyledTitle>
        </StyledHeader>
        <TestimonialForm
          onSuccess={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <StyledHeader>
        <StyledTitle>
          <IconStar size={16} />
          Testimonials ({testimonials.length})
        </StyledTitle>
        <Button
          Icon={IconPlus}
          size="small"
          variant="secondary"
          onClick={() => setShowForm(true)}
        />
      </StyledHeader>

      {loading && <div>Loading testimonials...</div>}

      {!loading && testimonials.length === 0 && (
        <StyledEmptyState>
          <p>No testimonials yet</p>
          <Button
            Icon={IconPlus}
            title="Add First Testimonial"
            variant="secondary"
            onClick={() => setShowForm(true)}
          />
        </StyledEmptyState>
      )}

      {!loading && testimonials.length > 0 && (
        <>
          <StyledTestimonialList>
            {displayedTestimonials.map((testimonial) => (
              <StyledTestimonialItem key={testimonial.id}>
                <StyledTestimonialHeader>
                  <StyledCustomerName>
                    {testimonial.customerName}
                  </StyledCustomerName>
                  <TestimonialStatusBadge status={testimonial.status} />
                </StyledTestimonialHeader>

                <TestimonialRatingDisplay rating={testimonial.rating} />

                <StyledContent>{testimonial.content}</StyledContent>
              </StyledTestimonialItem>
            ))}
          </StyledTestimonialList>

          {hasMore && (
            <StyledViewAll onClick={onViewAll}>
              View all {testimonials.length} testimonials →
            </StyledViewAll>
          )}
        </>
      )}
    </StyledCard>
  );
};
