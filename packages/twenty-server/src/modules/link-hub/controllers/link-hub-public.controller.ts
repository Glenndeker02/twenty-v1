import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Headers,
  NotFoundException,
} from '@nestjs/common';

import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { LinkHubPublicService } from 'src/modules/link-hub/services/link-hub-public.service';
import { DomainManagerService } from 'src/engine/core-modules/domain-manager/services/domain-manager.service';

@Controller('links')
@UseGuards(PublicEndpointGuard, NoPermissionGuard)
export class LinkHubPublicController {
  constructor(
    private readonly linkHubPublicService: LinkHubPublicService,
    private readonly domainManagerService: DomainManagerService,
  ) {}

  @Get(':slug')
  async getLinkHub(
    @Param('slug') slug: string,
    @Headers('host') host: string,
  ) {
    // Extract workspace from subdomain or use default workspace resolution
    const workspaceId =
      await this.domainManagerService.getWorkspaceIdByOrigin(host);

    if (!workspaceId) {
      throw new NotFoundException('Workspace not found');
    }

    return await this.linkHubPublicService.getBySlug(slug, workspaceId);
  }

  @Post(':slug/click/:itemId')
  async trackClick(
    @Param('slug') slug: string,
    @Param('itemId') itemId: string,
    @Headers('host') host: string,
  ) {
    const workspaceId =
      await this.domainManagerService.getWorkspaceIdByOrigin(host);

    if (!workspaceId) {
      throw new NotFoundException('Workspace not found');
    }

    return await this.linkHubPublicService.trackClick(itemId, workspaceId);
  }
}
