import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
  Observable,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import { API_CONFIG } from '../constants/config';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

let apolloClient: ApolloClient<any> | null = null;
let metadataClient: ApolloClient<any> | null = null;

// Auth link to attach tokens to requests
const authLink = setContext(async (_, { headers }) => {
  const tokens = await StorageService.getAuthTokens();
  const workspaceId = await StorageService.getWorkspaceId();

  if (!tokens) {
    return { headers };
  }

  const token = tokens.accessOrWorkspaceAgnosticToken?.token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'x-locale': 'en',
      ...(workspaceId && { 'X-Workspace-Id': workspaceId }),
    },
  };
});

// Error handling link with token renewal
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      console.error('[GraphQL error]:', error.message);

      // Handle authentication errors with token renewal
      if (
        error.message === 'Unauthorized' ||
        error.extensions?.code === 'UNAUTHENTICATED'
      ) {
        return new Observable((observer) => {
          AuthService.renewToken()
            .then((renewed) => {
              if (renewed) {
                // Retry the operation with new token
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };
                forward(operation).subscribe(subscriber);
              } else {
                observer.error(new Error('Token renewal failed'));
              }
            })
            .catch((err) => {
              observer.error(err);
            });
        });
      }
    }
  }

  if (networkError) {
    console.error('[Network error]:', networkError);
  }
});

// Retry link for network failures
const retryLink = new RetryLink({
  delay: {
    initial: 3000,
    max: 10000,
    jitter: true,
  },
  attempts: {
    max: 2,
    retryIf: (error) => {
      // Don't retry authentication errors
      return !error?.message?.includes('Unauthorized');
    },
  },
});

// Create workspace GraphQL client
export const createApolloClient = () => {
  if (apolloClient) {
    return apolloClient;
  }

  const httpLink = new HttpLink({
    uri: API_CONFIG.GRAPHQL_URL,
  });

  apolloClient = new ApolloClient({
    link: from([errorLink, retryLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            companiesConnection: {
              keyArgs: ['filter', 'orderBy'],
              merge(existing, incoming, { args }) {
                if (!existing || !args?.after) {
                  return incoming;
                }
                return {
                  ...incoming,
                  edges: [...existing.edges, ...incoming.edges],
                };
              },
            },
            peopleConnection: {
              keyArgs: ['filter', 'orderBy'],
              merge(existing, incoming, { args }) {
                if (!existing || !args?.after) {
                  return incoming;
                }
                return {
                  ...incoming,
                  edges: [...existing.edges, ...incoming.edges],
                };
              },
            },
            opportunitiesConnection: {
              keyArgs: ['filter', 'orderBy'],
              merge(existing, incoming, { args }) {
                if (!existing || !args?.after) {
                  return incoming;
                }
                return {
                  ...incoming,
                  edges: [...existing.edges, ...incoming.edges],
                };
              },
            },
            testimonialsConnection: {
              keyArgs: ['filter', 'orderBy'],
              merge(existing, incoming, { args }) {
                if (!existing || !args?.after) {
                  return incoming;
                }
                return {
                  ...incoming,
                  edges: [...existing.edges, ...incoming.edges],
                };
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

  return apolloClient;
};

// Create metadata GraphQL client (for auth operations)
export const createMetadataClient = () => {
  if (metadataClient) {
    return metadataClient;
  }

  const httpLink = new HttpLink({
    uri: API_CONFIG.METADATA_URL,
  });

  metadataClient = new ApolloClient({
    link: from([errorLink, retryLink, authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });

  return metadataClient;
};

// Reset Apollo clients (useful for logout)
export const resetApolloClients = async () => {
  if (apolloClient) {
    await apolloClient.clearStore();
  }
  if (metadataClient) {
    await metadataClient.clearStore();
  }
};

export { apolloClient, metadataClient };
