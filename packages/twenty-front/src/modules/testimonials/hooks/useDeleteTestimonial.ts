import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';

export const useDeleteTestimonial = () => {
  const { deleteOneRecord, loading } = useDeleteOneRecord({
    objectNameSingular: CoreObjectNameSingular.Testimonial,
  });

  return {
    deleteTestimonial: deleteOneRecord,
    loading,
  };
};
