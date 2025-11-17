import { Avatar } from 'twenty-ui';
import styled from '@emotion/styled';
import { TestimonialRatingDisplay } from '@/testimonials/components/TestimonialRatingDisplay';
import { TestimonialStatusBadge } from '@/testimonials/components/TestimonialStatusBadge';
import { type Testimonial } from '@/testimonials/types/Testimonial';

const StyledCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledCustomerInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledCustomerName = styled.div`
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.primary};
`;

const StyledCustomerRole = styled.div`
  font-size: ${({ theme }) => theme.font.size.sm};
  color: ${({ theme }) => theme.font.color.tertiary};
`;

const StyledContent = styled.div`
  color: ${({ theme }) => theme.font.color.secondary};
  line-height: 1.5;
`;

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid ${({ theme }) => theme.border.color.light};
`;

export const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <StyledCard>
      <StyledHeader>
        <Avatar
          avatarUrl={testimonial.avatarUrl}
          placeholder={testimonial.customerName}
          size="lg"
          type="rounded"
        />
        <StyledCustomerInfo>
          <StyledCustomerName>{testimonial.customerName}</StyledCustomerName>
          {testimonial.customerRole && (
            <StyledCustomerRole>{testimonial.customerRole}</StyledCustomerRole>
          )}
        </StyledCustomerInfo>
        <TestimonialStatusBadge status={testimonial.status} />
      </StyledHeader>

      <TestimonialRatingDisplay rating={testimonial.rating} />

      <StyledContent>{testimonial.content}</StyledContent>

      <StyledFooter>
        <div>
          {new Date(testimonial.submittedAt).toLocaleDateString()}
        </div>
      </StyledFooter>
    </StyledCard>
  );
};
