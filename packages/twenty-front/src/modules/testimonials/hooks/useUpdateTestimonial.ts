import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';

export const useUpdateTestimonial = () => {
  const { updateOneRecord, loading } = useUpdateOneRecord({
    objectNameSingular: CoreObjectNameSingular.Testimonial,
  });

  return {
    updateTestimonial: updateOneRecord,
    loading,
  };
};
