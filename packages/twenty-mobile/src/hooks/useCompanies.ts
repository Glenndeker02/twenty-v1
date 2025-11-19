import { useQuery, useMutation, ApolloError } from '@apollo/client';
import {
  GET_COMPANIES,
  GET_COMPANY,
  CREATE_COMPANY,
  UPDATE_COMPANY,
  DELETE_COMPANY,
} from '../api/records.graphql';
import { Company, RecordConnection, RecordGqlOperationFilter } from '../types/records';

export const useCompanies = (
  filter?: RecordGqlOperationFilter,
  orderBy?: any,
  first: number = 50
) => {
  const { data, loading, error, fetchMore, refetch } = useQuery<{
    companies: RecordConnection<Company>;
  }>(GET_COMPANIES, {
    variables: {
      filter,
      orderBy: orderBy || [{ name: 'AscNullsFirst' }],
      first,
    },
    notifyOnNetworkStatusChange: true,
  });

  const loadMore = () => {
    if (!data?.companies?.pageInfo?.hasNextPage) return;

    return fetchMore({
      variables: {
        after: data.companies.pageInfo.endCursor,
      },
    });
  };

  return {
    companies: data?.companies?.edges?.map((edge) => edge.node) || [],
    loading,
    error,
    hasNextPage: data?.companies?.pageInfo?.hasNextPage || false,
    loadMore,
    refetch,
    totalCount: data?.companies?.totalCount || 0,
  };
};

export const useCompany = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{ company: Company }>(GET_COMPANY, {
    variables: { id },
    skip: !id,
  });

  return {
    company: data?.company,
    loading,
    error,
    refetch,
  };
};

export const useCreateCompany = () => {
  const [createCompany, { loading, error }] = useMutation<
    { createCompany: Company },
    { data: Partial<Company> }
  >(CREATE_COMPANY, {
    refetchQueries: ['GetCompanies'],
  });

  return {
    createCompany: (data: Partial<Company>) => createCompany({ variables: { data } }),
    loading,
    error,
  };
};

export const useUpdateCompany = () => {
  const [updateCompany, { loading, error }] = useMutation<
    { updateCompany: Company },
    { id: string; data: Partial<Company> }
  >(UPDATE_COMPANY);

  return {
    updateCompany: (id: string, data: Partial<Company>) =>
      updateCompany({ variables: { id, data } }),
    loading,
    error,
  };
};

export const useDeleteCompany = () => {
  const [deleteCompany, { loading, error }] = useMutation<
    { deleteCompany: { id: string } },
    { id: string }
  >(DELETE_COMPANY, {
    refetchQueries: ['GetCompanies'],
  });

  return {
    deleteCompany: (id: string) => deleteCompany({ variables: { id } }),
    loading,
    error,
  };
};
