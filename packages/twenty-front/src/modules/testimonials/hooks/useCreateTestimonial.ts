import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';

export const useCreateTestimonial = () => {
  const { createOneRecord, loading } = useCreateOneRecord({
    objectNameSingular: CoreObjectNameSingular.Testimonial,
  });

  return {
    createTestimonial: createOneRecord,
    loading,
  };
};
