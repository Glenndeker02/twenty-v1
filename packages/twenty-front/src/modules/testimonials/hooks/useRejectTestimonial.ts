import { useUpdateTestimonial } from '@/testimonials/hooks/useUpdateTestimonial';
import { useCallback } from 'react';

export const useRejectTestimonial = () => {
  const { updateTestimonial, loading } = useUpdateTestimonial();

  const rejectTestimonial = useCallback(
    async (testimonialId: string) => {
      return updateTestimonial({
        idToUpdate: testimonialId,
        updateOneRecordInput: {
          status: 'REJECTED',
        },
      });
    },
    [updateTestimonial],
  );

  return {
    rejectTestimonial,
    loading,
  };
};
