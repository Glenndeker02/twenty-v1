import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LinkHubWorkspaceEntity } from 'src/modules/link-hub/standard-objects/link-hub.workspace-entity';
import { LinkHubItemWorkspaceEntity } from 'src/modules/link-hub/standard-objects/link-hub-item.workspace-entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';

export interface LinkHubPublicResponse {
  title: string;
  description: string | null;
  avatarUrl: string | null;
  backgroundColor: string;
  textColor: string;
  items: LinkHubItemPublicResponse[];
}

export interface LinkHubItemPublicResponse {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  order: number;
}

@Injectable()
export class LinkHubPublicService {
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
  ) {}

  async getBySlug(
    slug: string,
    workspaceId: string,
  ): Promise<LinkHubPublicResponse> {
    const linkHubRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<LinkHubWorkspaceEntity>(
        workspaceId,
        'linkHub',
      );

    const linkHubItemRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<LinkHubItemWorkspaceEntity>(
        workspaceId,
        'linkHubItem',
      );

    // Find the link hub by slug
    const linkHub = await linkHubRepository.findOne({
      where: { slug, isActive: true },
    });

    if (!linkHub) {
      throw new NotFoundException('Link hub not found');
    }

    // Increment view count
    await linkHubRepository.update(linkHub.id, {
      viewCount: linkHub.viewCount + 1,
    });

    // Get all visible items ordered by their order field
    const items = await linkHubItemRepository.find({
      where: { linkHubId: linkHub.id, isVisible: true },
      order: { order: 'ASC' },
    });

    return {
      title: linkHub.title,
      description: linkHub.description,
      avatarUrl: linkHub.avatarUrl,
      backgroundColor: linkHub.backgroundColor,
      textColor: linkHub.textColor,
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        icon: item.icon,
        order: item.order,
      })),
    };
  }

  async trackClick(
    itemId: string,
    workspaceId: string,
  ): Promise<{ success: boolean }> {
    const linkHubItemRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<LinkHubItemWorkspaceEntity>(
        workspaceId,
        'linkHubItem',
      );

    const item = await linkHubItemRepository.findOne({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Link hub item not found');
    }

    // Increment click count
    await linkHubItemRepository.update(itemId, {
      clickCount: item.clickCount + 1,
    });

    return { success: true };
  }
}
