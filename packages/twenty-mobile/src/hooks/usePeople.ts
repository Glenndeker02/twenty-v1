import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PEOPLE,
  GET_PERSON,
  CREATE_PERSON,
  UPDATE_PERSON,
  DELETE_PERSON,
} from '../api/records.graphql';
import { Person, RecordConnection, RecordGqlOperationFilter } from '../types/records';

export const usePeople = (
  filter?: RecordGqlOperationFilter,
  orderBy?: any,
  first: number = 50
) => {
  const { data, loading, error, fetchMore, refetch } = useQuery<{
    people: RecordConnection<Person>;
  }>(GET_PEOPLE, {
    variables: {
      filter,
      orderBy: orderBy || [{ createdAt: 'DescNullsLast' }],
      first,
    },
    notifyOnNetworkStatusChange: true,
  });

  const loadMore = () => {
    if (!data?.people?.pageInfo?.hasNextPage) return;

    return fetchMore({
      variables: {
        after: data.people.pageInfo.endCursor,
      },
    });
  };

  return {
    people: data?.people?.edges?.map((edge) => edge.node) || [],
    loading,
    error,
    hasNextPage: data?.people?.pageInfo?.hasNextPage || false,
    loadMore,
    refetch,
    totalCount: data?.people?.totalCount || 0,
  };
};

export const usePerson = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{ person: Person }>(GET_PERSON, {
    variables: { id },
    skip: !id,
  });

  return {
    person: data?.person,
    loading,
    error,
    refetch,
  };
};

export const useCreatePerson = () => {
  const [createPerson, { loading, error }] = useMutation<
    { createPerson: Person },
    { data: Partial<Person> }
  >(CREATE_PERSON, {
    refetchQueries: ['GetPeople'],
  });

  return {
    createPerson: (data: Partial<Person>) => createPerson({ variables: { data } }),
    loading,
    error,
  };
};

export const useUpdatePerson = () => {
  const [updatePerson, { loading, error }] = useMutation<
    { updatePerson: Person },
    { id: string; data: Partial<Person> }
  >(UPDATE_PERSON);

  return {
    updatePerson: (id: string, data: Partial<Person>) =>
      updatePerson({ variables: { id, data } }),
    loading,
    error,
  };
};

export const useDeletePerson = () => {
  const [deletePerson, { loading, error }] = useMutation<
    { deletePerson: { id: string } },
    { id: string }
  >(DELETE_PERSON, {
    refetchQueries: ['GetPeople'],
  });

  return {
    deletePerson: (id: string) => deletePerson({ variables: { id } }),
    loading,
    error,
  };
};
