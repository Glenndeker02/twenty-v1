import { useQuery, useMutation } from '@apollo/client';
import {
  GET_TESTIMONIALS,
  GET_TESTIMONIAL,
  CREATE_TESTIMONIAL,
  UPDATE_TESTIMONIAL,
  DELETE_TESTIMONIAL,
  APPROVE_TESTIMONIAL,
  REJECT_TESTIMONIAL,
} from '../api/records.graphql';
import { Testimonial, RecordConnection, RecordGqlOperationFilter } from '../types/records';

export const useTestimonials = (
  filter?: RecordGqlOperationFilter,
  orderBy?: any,
  first: number = 50
) => {
  const { data, loading, error, fetchMore, refetch } = useQuery<{
    testimonials: RecordConnection<Testimonial>;
  }>(GET_TESTIMONIALS, {
    variables: {
      filter,
      orderBy: orderBy || [{ submittedAt: 'DescNullsLast' }],
      first,
    },
    notifyOnNetworkStatusChange: true,
  });

  const loadMore = () => {
    if (!data?.testimonials?.pageInfo?.hasNextPage) return;

    return fetchMore({
      variables: {
        after: data.testimonials.pageInfo.endCursor,
      },
    });
  };

  return {
    testimonials: data?.testimonials?.edges?.map((edge) => edge.node) || [],
    loading,
    error,
    hasNextPage: data?.testimonials?.pageInfo?.hasNextPage || false,
    loadMore,
    refetch,
    totalCount: data?.testimonials?.totalCount || 0,
  };
};

export const useTestimonial = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{ testimonial: Testimonial }>(
    GET_TESTIMONIAL,
    {
      variables: { id },
      skip: !id,
    }
  );

  return {
    testimonial: data?.testimonial,
    loading,
    error,
    refetch,
  };
};

export const useCreateTestimonial = () => {
  const [createTestimonial, { loading, error }] = useMutation<
    { createTestimonial: Testimonial },
    { data: Partial<Testimonial> }
  >(CREATE_TESTIMONIAL, {
    refetchQueries: ['GetTestimonials'],
  });

  return {
    createTestimonial: (data: Partial<Testimonial>) =>
      createTestimonial({ variables: { data } }),
    loading,
    error,
  };
};

export const useUpdateTestimonial = () => {
  const [updateTestimonial, { loading, error }] = useMutation<
    { updateTestimonial: Testimonial },
    { id: string; data: Partial<Testimonial> }
  >(UPDATE_TESTIMONIAL);

  return {
    updateTestimonial: (id: string, data: Partial<Testimonial>) =>
      updateTestimonial({ variables: { id, data } }),
    loading,
    error,
  };
};

export const useDeleteTestimonial = () => {
  const [deleteTestimonial, { loading, error }] = useMutation<
    { deleteTestimonial: { id: string } },
    { id: string }
  >(DELETE_TESTIMONIAL, {
    refetchQueries: ['GetTestimonials'],
  });

  return {
    deleteTestimonial: (id: string) => deleteTestimonial({ variables: { id } }),
    loading,
    error,
  };
};

export const useApproveTestimonial = () => {
  const [approveTestimonial, { loading, error }] = useMutation<
    { updateTestimonial: Testimonial },
    { id: string }
  >(APPROVE_TESTIMONIAL, {
    refetchQueries: ['GetTestimonials'],
  });

  return {
    approveTestimonial: (id: string) => approveTestimonial({ variables: { id } }),
    loading,
    error,
  };
};

export const useRejectTestimonial = () => {
  const [rejectTestimonial, { loading, error }] = useMutation<
    { updateTestimonial: Testimonial },
    { id: string }
  >(REJECT_TESTIMONIAL, {
    refetchQueries: ['GetTestimonials'],
  });

  return {
    rejectTestimonial: (id: string) => rejectTestimonial({ variables: { id } }),
    loading,
    error,
  };
};
