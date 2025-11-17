import styled from '@emotion/styled';
import { useTestimonials } from '@/testimonials/hooks/useTestimonials';
import { TestimonialCard } from '@/testimonials/components/TestimonialCard';
import { useState } from 'react';
import { Button, IconPlus } from 'twenty-ui';
import { type TestimonialStatus } from '@/testimonials/types/Testimonial';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(6)};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTitle = styled.h1`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)};
`;

const StyledEmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(12)};
  color: ${({ theme }) => theme.font.color.tertiary};
`;

type TestimonialListProps = {
  statusFilter?: TestimonialStatus[];
  minRating?: number;
  onCreateClick?: () => void;
};

export const TestimonialList = ({
  statusFilter,
  minRating,
  onCreateClick,
}: TestimonialListProps) => {
  const [filter, setFilter] = useState<any>({});

  // Build filter based on props
  const buildFilter = () => {
    const filterObj: any = {};

    if (statusFilter && statusFilter.length > 0) {
      filterObj.status = { in: statusFilter };
    }

    if (minRating) {
      filterObj.rating = { gte: minRating };
    }

    return filterObj;
  };

  const { testimonials, loading } = useTestimonials({
    filter: buildFilter(),
    orderBy: { submittedAt: 'DescNullsLast' },
  });

  if (loading) {
    return <StyledContainer>Loading testimonials...</StyledContainer>;
  }

  return (
    <StyledContainer>
      <StyledHeader>
        <StyledTitle>Testimonials</StyledTitle>
        {onCreateClick && (
          <Button
            Icon={IconPlus}
            title="Add Testimonial"
            onClick={onCreateClick}
          />
        )}
      </StyledHeader>

      {testimonials.length === 0 ? (
        <StyledEmptyState>
          <p>No testimonials found</p>
          {onCreateClick && (
            <Button
              Icon={IconPlus}
              title="Create your first testimonial"
              onClick={onCreateClick}
            />
          )}
        </StyledEmptyState>
      ) : (
        <StyledGrid>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </StyledGrid>
      )}
    </StyledContainer>
  );
};
