import styled from '@emotion/styled';
import { useState } from 'react';
import { Button, TextInput, IconStar, IconStarFilled } from 'twenty-ui';
import { useCreateTestimonial } from '@/testimonials/hooks/useCreateTestimonial';
import { useUpdateTestimonial } from '@/testimonials/hooks/useUpdateTestimonial';
import { type Testimonial } from '@/testimonials/types/Testimonial';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.border.radius.md};
  max-width: 600px;
`;

const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.secondary};
`;

const StyledTextarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing(2)};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.font.color.primary};
  background: ${({ theme }) => theme.background.primary};
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.blue};
  }
`;

const StyledRatingSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledStar = styled.button<{ selected: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme, selected }) =>
    selected ? theme.color.yellow : theme.font.color.tertiary};
  display: flex;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.color.yellow};
  }
`;

const StyledButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

const StyledRequired = styled.span`
  color: ${({ theme }) => theme.color.red};
`;

type TestimonialFormProps = {
  testimonial?: Testimonial;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const TestimonialForm = ({
  testimonial,
  onSuccess,
  onCancel,
}: TestimonialFormProps) => {
  const isEditing = !!testimonial;

  const [customerName, setCustomerName] = useState(
    testimonial?.customerName || '',
  );
  const [customerRole, setCustomerRole] = useState(
    testimonial?.customerRole || '',
  );
  const [content, setContent] = useState(testimonial?.content || '');
  const [rating, setRating] = useState(testimonial?.rating || 5);
  const [avatarUrl, setAvatarUrl] = useState(testimonial?.avatarUrl || '');

  const { createTestimonial, loading: creating } = useCreateTestimonial();
  const { updateTestimonial, loading: updating } = useUpdateTestimonial();

  const loading = creating || updating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !content.trim()) {
      alert('Customer name and content are required');
      return;
    }

    const testimonialData = {
      customerName: customerName.trim(),
      customerRole: customerRole.trim() || null,
      content: content.trim(),
      rating,
      avatarUrl: avatarUrl.trim() || null,
      submittedAt: new Date().toISOString(),
      status: 'DRAFT',
    };

    try {
      if (isEditing) {
        await updateTestimonial({
          idToUpdate: testimonial.id,
          updateOneRecordInput: testimonialData,
        });
      } else {
        await createTestimonial(testimonialData);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Failed to save testimonial');
    }
  };

  return (
    <StyledFormContainer>
      <form onSubmit={handleSubmit}>
        <StyledFormGroup>
          <StyledLabel>
            Customer Name <StyledRequired>*</StyledRequired>
          </StyledLabel>
          <TextInput
            value={customerName}
            onChange={setCustomerName}
            placeholder="John Doe"
            fullWidth
          />
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Customer Role / Company</StyledLabel>
          <TextInput
            value={customerRole}
            onChange={setCustomerRole}
            placeholder="CEO at Acme Corp"
            fullWidth
          />
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>
            Testimonial Content <StyledRequired>*</StyledRequired>
          </StyledLabel>
          <StyledTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience..."
          />
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>
            Rating <StyledRequired>*</StyledRequired>
          </StyledLabel>
          <StyledRatingSelector>
            {[1, 2, 3, 4, 5].map((star) => (
              <StyledStar
                key={star}
                type="button"
                selected={star <= rating}
                onClick={() => setRating(star)}
              >
                {star <= rating ? (
                  <IconStarFilled size={24} />
                ) : (
                  <IconStar size={24} />
                )}
              </StyledStar>
            ))}
          </StyledRatingSelector>
        </StyledFormGroup>

        <StyledFormGroup>
          <StyledLabel>Avatar URL</StyledLabel>
          <TextInput
            value={avatarUrl}
            onChange={setAvatarUrl}
            placeholder="https://example.com/avatar.jpg"
            fullWidth
          />
        </StyledFormGroup>

        <StyledButtonGroup>
          {onCancel && (
            <Button
              title="Cancel"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            />
          )}
          <Button
            title={isEditing ? 'Update' : 'Create'}
            variant="primary"
            type="submit"
            disabled={loading}
          />
        </StyledButtonGroup>
      </form>
    </StyledFormContainer>
  );
};
