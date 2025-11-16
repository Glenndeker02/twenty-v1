import {
  Controller,
  Get,
  Req,
  Res,
  UseFilters,
  UseGuards,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Response, Request } from 'express';
import { SettingsPath } from 'twenty-shared/types';
import { getSettingsPath } from 'twenty-shared/utils';
import { Repository } from 'typeorm';

import {
  AuthException,
  AuthExceptionCode,
} from 'src/engine/core-modules/auth/auth.exception';
import { AuthRestApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-rest-api-exception.filter';
import { WhopService } from 'src/engine/core-modules/auth/services/whop.service';
import { TransientTokenService } from 'src/engine/core-modules/auth/token/services/transient-token.service';
import { WorkspaceDomainsService } from 'src/engine/core-modules/domain/workspace-domains/services/workspace-domains.service';
import { GuardRedirectService } from 'src/engine/core-modules/guard-redirect/services/guard-redirect.service';
import { OnboardingService } from 'src/engine/core-modules/onboarding/onboarding.service';
import { TwentyConfigService } from 'src/engine/core-modules/twenty-config/twenty-config.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';

@Controller('auth/whop')
@UseFilters(AuthRestApiExceptionFilter)
export class WhopAuthController {
  constructor(
    private readonly whopService: WhopService,
    private readonly transientTokenService: TransientTokenService,
    private readonly twentyConfigService: TwentyConfigService,
    private readonly onboardingService: OnboardingService,
    private readonly workspaceDomainsService: WorkspaceDomainsService,
    private readonly guardRedirectService: GuardRedirectService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  @Get()
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async whopAuth(
    @Query('transientToken') transientToken: string,
    @Query('redirectLocation') redirectLocation: string,
    @Res() res: Response,
  ) {
    // Build the Whop OAuth authorization URL
    const authUrl = this.whopService.getAuthorizationUrl(
      transientToken,
      redirectLocation,
    );

    return res.redirect(authUrl);
  }

  @Get('callback')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async whopAuthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let workspace: WorkspaceEntity | null = null;

    try {
      if (!code) {
        throw new AuthException(
          'Authorization code not provided',
          AuthExceptionCode.INVALID_INPUT,
        );
      }

      // Parse state parameter
      const stateData = JSON.parse(state);
      const { transientToken, redirectLocation } = stateData;

      // Verify transient token
      const { workspaceMemberId, userId, workspaceId } =
        await this.transientTokenService.verifyTransientToken(transientToken);

      if (!workspaceId) {
        throw new AuthException(
          'Workspace not found',
          AuthExceptionCode.WORKSPACE_NOT_FOUND,
        );
      }

      workspace = await this.workspaceRepository.findOneBy({
        id: workspaceId,
      });

      if (!workspace) {
        throw new AuthException(
          'Workspace not found',
          AuthExceptionCode.WORKSPACE_NOT_FOUND,
        );
      }

      // Exchange authorization code for access token
      const tokenData = await this.whopService.exchangeCodeForToken(code);

      // Save the connected account
      const connectedAccountId = await this.whopService.saveConnectedAccount({
        workspaceMemberId,
        workspaceId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
      });

      if (userId) {
        await this.onboardingService.setOnboardingConnectAccountPending({
          userId,
          workspaceId,
          value: false,
        });
      }

      const pathname =
        redirectLocation ||
        getSettingsPath(SettingsPath.AccountsConfiguration, {
          connectedAccountId,
        });

      const url = this.workspaceDomainsService.buildWorkspaceURL({
        workspace,
        pathname,
      });

      return res.redirect(url.toString());
    } catch (error) {
      return res.redirect(
        this.guardRedirectService.getRedirectErrorUrlAndCaptureExceptions({
          error,
          workspace: workspace ?? {
            subdomain: this.twentyConfigService.get('DEFAULT_SUBDOMAIN'),
            customDomain: null,
          },
          pathname: getSettingsPath(SettingsPath.Accounts),
        }),
      );
    }
  }
}
