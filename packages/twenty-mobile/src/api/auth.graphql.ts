import { gql } from '@apollo/client';

// Step 1: Get login token from credentials
export const GET_LOGIN_TOKEN_FROM_CREDENTIALS = gql`
  mutation GetLoginTokenFromCredentials($email: String!, $password: String!) {
    getLoginTokenFromCredentials(email: $email, password: $password) {
      loginToken {
        token
        expiresAt
      }
    }
  }
`;

// Step 2: Exchange login token for auth tokens
export const GET_AUTH_TOKENS_FROM_LOGIN_TOKEN = gql`
  mutation GetAuthTokensFromLoginToken($loginToken: String!) {
    getAuthTokensFromLoginToken(loginToken: $loginToken) {
      tokens {
        accessOrWorkspaceAgnosticToken {
          token
          expiresAt
        }
        refreshToken {
          token
          expiresAt
        }
      }
    }
  }
`;

// Renew access token using refresh token
export const RENEW_TOKEN = gql`
  mutation RenewToken($refreshToken: String!) {
    renewToken(refreshToken: $refreshToken) {
      tokens {
        accessOrWorkspaceAgnosticToken {
          token
          expiresAt
        }
        refreshToken {
          token
          expiresAt
        }
      }
    }
  }
`;

// Get current user and workspace data
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    currentUser {
      id
      email
      firstName
      lastName
      avatarUrl
      locale
      workspaceMember {
        id
        name {
          firstName
          lastName
        }
        colorScheme
        locale
        avatarUrl
        userId
        workspaceId
      }
      workspaces {
        edges {
          node {
            workspace {
              id
              displayName
              logo
              domainName
              allowImpersonation
              activationStatus
              metadataVersion
            }
            workspaceMember {
              id
              name {
                firstName
                lastName
              }
              colorScheme
              locale
              avatarUrl
            }
          }
        }
      }
    }
    currentWorkspace {
      id
      displayName
      logo
      domainName
      metadataVersion
    }
  }
`;

// Check if user exists
export const CHECK_USER_EXISTS = gql`
  query CheckUserExists($email: String!) {
    checkUserExists(email: $email) {
      exists
    }
  }
`;

// Sign up mutation
export const SIGN_UP = gql`
  mutation SignUp(
    $email: String!
    $password: String!
    $workspaceInviteHash: String
    $captchaToken: String
  ) {
    signUp(
      email: $email
      password: $password
      workspaceInviteHash: $workspaceInviteHash
      captchaToken: $captchaToken
    ) {
      loginToken {
        token
        expiresAt
      }
    }
  }
`;
