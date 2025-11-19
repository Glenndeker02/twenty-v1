import { createMetadataClient } from '../api/apollo-client';
import { StorageService } from './storage.service';
import {
  GET_LOGIN_TOKEN_FROM_CREDENTIALS,
  GET_AUTH_TOKENS_FROM_LOGIN_TOKEN,
  GET_CURRENT_USER,
  RENEW_TOKEN,
  SIGN_UP,
  CHECK_USER_EXISTS,
} from '../api/auth.graphql';
import {
  AuthTokenPair,
  User,
  Workspace,
  LoginTokenResponse,
  AuthTokensResponse,
  CurrentUserResponse,
} from '../types/auth';

export class AuthService {
  private static metadataClient = createMetadataClient();

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<{
    success: boolean;
    user?: User;
    workspace?: Workspace;
    error?: string;
  }> {
    try {
      // Step 1: Get login token
      const { data: loginData } = await this.metadataClient.mutate<{
        getLoginTokenFromCredentials: LoginTokenResponse;
      }>({
        mutation: GET_LOGIN_TOKEN_FROM_CREDENTIALS,
        variables: { email, password },
      });

      if (!loginData?.getLoginTokenFromCredentials?.loginToken) {
        return { success: false, error: 'Invalid credentials' };
      }

      const loginToken = loginData.getLoginTokenFromCredentials.loginToken.token;

      // Step 2: Exchange login token for auth tokens
      const { data: authData } = await this.metadataClient.mutate<{
        getAuthTokensFromLoginToken: AuthTokensResponse;
      }>({
        mutation: GET_AUTH_TOKENS_FROM_LOGIN_TOKEN,
        variables: { loginToken },
      });

      if (!authData?.getAuthTokensFromLoginToken?.tokens) {
        return { success: false, error: 'Failed to get auth tokens' };
      }

      const tokens = authData.getAuthTokensFromLoginToken.tokens;
      await StorageService.setAuthTokens(tokens);

      // Step 3: Load user and workspace data
      const { data: userData } = await this.metadataClient.query<CurrentUserResponse>({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only',
      });

      if (!userData?.currentUser) {
        return { success: false, error: 'Failed to load user data' };
      }

      // Store workspace ID if available
      if (userData.currentWorkspace?.id) {
        await StorageService.setWorkspaceId(userData.currentWorkspace.id);
      }

      // Store user data
      await StorageService.setUserData(userData.currentUser);

      return {
        success: true,
        user: userData.currentUser,
        workspace: userData.currentWorkspace,
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error.message || 'Sign in failed',
      };
    }
  }

  // Sign up with email and password
  static async signUp(
    email: string,
    password: string,
    workspaceInviteHash?: string
  ): Promise<{
    success: boolean;
    user?: User;
    workspace?: Workspace;
    error?: string;
  }> {
    try {
      // Step 1: Sign up and get login token
      const { data: signUpData } = await this.metadataClient.mutate<{
        signUp: LoginTokenResponse;
      }>({
        mutation: SIGN_UP,
        variables: {
          email,
          password,
          workspaceInviteHash,
          captchaToken: null,
        },
      });

      if (!signUpData?.signUp?.loginToken) {
        return { success: false, error: 'Sign up failed' };
      }

      const loginToken = signUpData.signUp.loginToken.token;

      // Step 2: Exchange login token for auth tokens
      const { data: authData } = await this.metadataClient.mutate<{
        getAuthTokensFromLoginToken: AuthTokensResponse;
      }>({
        mutation: GET_AUTH_TOKENS_FROM_LOGIN_TOKEN,
        variables: { loginToken },
      });

      if (!authData?.getAuthTokensFromLoginToken?.tokens) {
        return { success: false, error: 'Failed to get auth tokens' };
      }

      const tokens = authData.getAuthTokensFromLoginToken.tokens;
      await StorageService.setAuthTokens(tokens);

      // Step 3: Load user data
      const { data: userData } = await this.metadataClient.query<CurrentUserResponse>({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only',
      });

      if (!userData?.currentUser) {
        return { success: false, error: 'Failed to load user data' };
      }

      if (userData.currentWorkspace?.id) {
        await StorageService.setWorkspaceId(userData.currentWorkspace.id);
      }

      await StorageService.setUserData(userData.currentUser);

      return {
        success: true,
        user: userData.currentUser,
        workspace: userData.currentWorkspace,
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error.message || 'Sign up failed',
      };
    }
  }

  // Check if user exists
  static async checkUserExists(email: string): Promise<boolean> {
    try {
      const { data } = await this.metadataClient.query<{
        checkUserExists: { exists: boolean };
      }>({
        query: CHECK_USER_EXISTS,
        variables: { email },
      });
      return data?.checkUserExists?.exists || false;
    } catch (error) {
      console.error('Check user exists error:', error);
      return false;
    }
  }

  // Renew access token using refresh token
  static async renewToken(): Promise<boolean> {
    try {
      const tokens = await StorageService.getAuthTokens();
      if (!tokens?.refreshToken) {
        return false;
      }

      const { data } = await this.metadataClient.mutate<{
        renewToken: AuthTokensResponse;
      }>({
        mutation: RENEW_TOKEN,
        variables: { refreshToken: tokens.refreshToken.token },
      });

      if (!data?.renewToken?.tokens) {
        return false;
      }

      await StorageService.setAuthTokens(data.renewToken.tokens);
      return true;
    } catch (error) {
      console.error('Token renewal error:', error);
      return false;
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await StorageService.clearAll();
      // Reset Apollo client cache
      await this.metadataClient.clearStore();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const tokens = await StorageService.getAuthTokens();
    if (!tokens) {
      return false;
    }

    // Check if token is expired
    const expiresAt = new Date(tokens.accessOrWorkspaceAgnosticToken.expiresAt);
    const now = new Date();

    if (expiresAt <= now) {
      // Try to renew token
      return await this.renewToken();
    }

    return true;
  }

  // Get current user data
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await this.metadataClient.query<CurrentUserResponse>({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only',
      });

      return data?.currentUser || null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}
