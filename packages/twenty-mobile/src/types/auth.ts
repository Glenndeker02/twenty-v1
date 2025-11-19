export type AuthToken = {
  token: string;
  expiresAt: string;
};

export type AuthTokenPair = {
  accessOrWorkspaceAgnosticToken: AuthToken;
  refreshToken: AuthToken;
};

export type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  locale: string;
  workspaceMember: WorkspaceMember | null;
  workspaces: WorkspaceEdge[];
};

export type WorkspaceMember = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  colorScheme: string;
  locale: string;
  avatarUrl: string | null;
  userId: string;
  workspaceId: string;
};

export type Workspace = {
  id: string;
  displayName: string;
  logo: string | null;
  domainName: string | null;
  allowImpersonation: boolean;
  activationStatus: string;
  metadataVersion: number;
  currentBillingSubscription: any | null;
};

export type WorkspaceEdge = {
  node: {
    workspace: Workspace;
    workspaceMember: WorkspaceMember;
  };
};

export type LoginTokenResponse = {
  loginToken: AuthToken;
};

export type AuthTokensResponse = {
  tokens: AuthTokenPair;
};

export type CurrentUserResponse = {
  currentUser: User;
  currentWorkspace: Workspace;
};
