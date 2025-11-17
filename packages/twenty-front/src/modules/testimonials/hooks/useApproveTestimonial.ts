import { useUpdateTestimonial } from '@/testimonials/hooks/useUpdateTestimonial';
import { useCallback } from 'react';

export const useApproveTestimonial = () => {
  const { updateTestimonial, loading } = useUpdateTestimonial();

  const approveTestimonial = useCallback(
    async (testimonialId: string, approvedById?: string) => {
      return updateTestimonial({
        idToUpdate: testimonialId,
        updateOneRecordInput: {
          status: 'APPROVED',
          ...(approvedById && { approvedById }),
        },
      });
    },
    [updateTestimonial],
  );

  return {
    approveTestimonial,
    loading,
  };
};
