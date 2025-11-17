import { IconStar, IconStarFilled } from 'twenty-ui';
import styled from '@emotion/styled';

const StyledRatingContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(0.5)};
  align-items: center;
`;

const StyledStar = styled.div<{ filled: boolean }>`
  color: ${({ theme, filled }) =>
    filled ? theme.color.yellow : theme.font.color.tertiary};
  display: flex;
`;

export const TestimonialRatingDisplay = ({ rating }: { rating: number }) => {
  const stars = Array.from({ length: 5 }, (_, index) => index + 1);

  return (
    <StyledRatingContainer>
      {stars.map((star) => (
        <StyledStar key={star} filled={star <= rating}>
          {star <= rating ? <IconStarFilled size={16} /> : <IconStar size={16} />}
        </StyledStar>
      ))}
    </StyledRatingContainer>
  );
};
