import Constants from 'expo-constants';

const ENV = {
  development: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    graphqlEndpoint: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT || '/graphql',
    metadataEndpoint: process.env.EXPO_PUBLIC_METADATA_ENDPOINT || '/metadata',
    restEndpoint: process.env.EXPO_PUBLIC_REST_ENDPOINT || '/rest',
  },
  staging: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://staging-api.twenty.com',
    graphqlEndpoint: '/graphql',
    metadataEndpoint: '/metadata',
    restEndpoint: '/rest',
  },
  production: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.twenty.com',
    graphqlEndpoint: '/graphql',
    metadataEndpoint: '/metadata',
    restEndpoint: '/rest',
  },
};

const getEnvVars = (env = Constants.expoConfig?.extra?.env || 'development') => {
  if (env === 'production') return ENV.production;
  if (env === 'staging') return ENV.staging;
  return ENV.development;
};

export const config = getEnvVars(process.env.EXPO_PUBLIC_ENV);

export const API_CONFIG = {
  GRAPHQL_URL: `${config.apiUrl}${config.graphqlEndpoint}`,
  METADATA_URL: `${config.apiUrl}${config.metadataEndpoint}`,
  REST_URL: `${config.apiUrl}${config.restEndpoint}`,
  BASE_URL: config.apiUrl,
};
