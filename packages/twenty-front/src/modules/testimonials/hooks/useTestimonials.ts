import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { type Testimonial } from '@/testimonials/types/Testimonial';
import { type RecordGqlOperationFilter } from 'twenty-shared/types';

export const useTestimonials = ({
  filter,
  orderBy,
  skip,
}: {
  filter?: RecordGqlOperationFilter;
  orderBy?: any;
  skip?: boolean;
} = {}) => {
  const { records, loading, fetchMore } = useFindManyRecords<Testimonial>({
    objectNameSingular: CoreObjectNameSingular.Testimonial,
    filter,
    orderBy: orderBy || { submittedAt: 'DescNullsLast' },
    skip,
  });

  return {
    testimonials: records,
    loading,
    fetchMore,
  };
};
