import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { ConnectedAccountProvider } from 'twenty-shared/types';
import { firstValueFrom } from 'rxjs';

import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { TwentyORMManager } from 'src/engine/twenty-orm/twenty-orm.manager';
import { ConnectedAccountWorkspaceEntity } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';

export type WhopTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export type SaveWhopConnectedAccountParams = {
  workspaceMemberId: string;
  workspaceId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

@Injectable()
export class WhopService {
  constructor(
    private readonly httpService: HttpService,
    private readonly twentyConfigService: TwentyConfigService,
    private readonly twentyORMManager: TwentyORMManager,
  ) {}

  getAuthorizationUrl(transientToken: string, redirectLocation?: string): string {
    const clientId = this.twentyConfigService.get('AUTH_WHOP_CLIENT_ID');
    const redirectUri = this.twentyConfigService.get('AUTH_WHOP_CALLBACK_URL');

    const state = JSON.stringify({
      transientToken,
      redirectLocation,
    });

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      state,
    });

    return `https://whop.com/oauth?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string): Promise<WhopTokenResponse> {
    const clientId = this.twentyConfigService.get('AUTH_WHOP_CLIENT_ID');
    const clientSecret = this.twentyConfigService.get('AUTH_WHOP_CLIENT_SECRET');
    const redirectUri = this.twentyConfigService.get('AUTH_WHOP_CALLBACK_URL');

    const tokenUrl = 'https://data.whop.com/api/v3/oauth/token';

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post<WhopTokenResponse>(
          tokenUrl,
          params.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to exchange Whop authorization code: ${error.message}`);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<WhopTokenResponse> {
    const clientId = this.twentyConfigService.get('AUTH_WHOP_CLIENT_ID');
    const clientSecret = this.twentyConfigService.get('AUTH_WHOP_CLIENT_SECRET');

    const tokenUrl = 'https://data.whop.com/api/v3/oauth/token';

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post<WhopTokenResponse>(
          tokenUrl,
          params.toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to refresh Whop access token: ${error.message}`);
    }
  }

  async saveConnectedAccount(
    params: SaveWhopConnectedAccountParams,
  ): Promise<string> {
    const { workspaceMemberId, workspaceId, accessToken, refreshToken, expiresIn } = params;

    const connectedAccountRepository =
      await this.twentyORMManager.getRepository<ConnectedAccountWorkspaceEntity>(
        'connectedAccount',
      );

    // Check if connected account already exists for this workspace member
    const existingConnectedAccount = await connectedAccountRepository.findOne({
      where: {
        accountOwnerId: workspaceMemberId,
        provider: ConnectedAccountProvider.WHOP,
      },
    });

    if (existingConnectedAccount) {
      // Update existing account
      await connectedAccountRepository.update(
        { id: existingConnectedAccount.id },
        {
          accessToken,
          refreshToken,
          lastCredentialsRefreshedAt: new Date(),
          authFailedAt: null,
        },
      );

      return existingConnectedAccount.id;
    }

    // Fetch user information from Whop to get the handle
    const userInfo = await this.getAuthenticatedUser(accessToken);

    // Create new connected account
    const connectedAccount = connectedAccountRepository.create({
      handle: userInfo.email || userInfo.username || userInfo.id,
      provider: ConnectedAccountProvider.WHOP,
      accessToken,
      refreshToken,
      accountOwnerId: workspaceMemberId,
      lastCredentialsRefreshedAt: new Date(),
      authFailedAt: null,
    });

    await connectedAccountRepository.save(connectedAccount);

    return connectedAccount.id;
  }

  async getAuthenticatedUser(accessToken: string): Promise<{
    id: string;
    email?: string;
    username?: string;
  }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('https://api.whop.com/v5/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Whop user information: ${error.message}`);
    }
  }
}
