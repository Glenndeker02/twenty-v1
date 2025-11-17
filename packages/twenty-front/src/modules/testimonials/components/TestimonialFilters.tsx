import styled from '@emotion/styled';
import { Select, type SelectOption } from 'twenty-ui';
import { TESTIMONIAL_STATUSES, TESTIMONIAL_STATUS_LABELS } from '@/testimonials/constants/TestimonialStatuses';
import { type TestimonialStatus } from '@/testimonials/types/Testimonial';

const StyledFiltersContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(4)};
  background: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.border.radius.md};
`;

const StyledFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  min-width: 200px;
`;

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.secondary};
`;

type TestimonialFiltersProps = {
  selectedStatus?: TestimonialStatus[];
  minRating?: number;
  onStatusChange?: (status: TestimonialStatus[]) => void;
  onMinRatingChange?: (rating: number) => void;
};

export const TestimonialFilters = ({
  selectedStatus = [],
  minRating = 1,
  onStatusChange,
  onMinRatingChange,
}: TestimonialFiltersProps) => {
  const statusOptions: SelectOption<string>[] = Object.entries(
    TESTIMONIAL_STATUSES,
  ).map(([key, value]) => ({
    label: TESTIMONIAL_STATUS_LABELS[value as TestimonialStatus],
    value: value,
  }));

  const ratingOptions: SelectOption<number>[] = [
    { label: 'All Ratings', value: 1 },
    { label: '2+ Stars', value: 2 },
    { label: '3+ Stars', value: 3 },
    { label: '4+ Stars', value: 4 },
    { label: '5 Stars Only', value: 5 },
  ];

  return (
    <StyledFiltersContainer>
      <StyledFilterGroup>
        <StyledLabel>Status</StyledLabel>
        <Select
          options={statusOptions}
          value={selectedStatus[0] || ''}
          onChange={(value) => {
            if (value) {
              onStatusChange?.([value as TestimonialStatus]);
            } else {
              onStatusChange?.([]);
            }
          }}
          fullWidth
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledLabel>Minimum Rating</StyledLabel>
        <Select
          options={ratingOptions}
          value={minRating}
          onChange={(value) => {
            if (typeof value === 'number') {
              onMinRatingChange?.(value);
            }
          }}
          fullWidth
        />
      </StyledFilterGroup>
    </StyledFiltersContainer>
  );
};
