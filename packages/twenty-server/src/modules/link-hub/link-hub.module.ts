import { Module } from '@nestjs/common';

import { LinkHubPublicController } from 'src/modules/link-hub/controllers/link-hub-public.controller';
import { LinkHubPublicService } from 'src/modules/link-hub/services/link-hub-public.service';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { DomainManagerModule } from 'src/engine/core-modules/domain-manager/domain-manager.module';

@Module({
  imports: [TwentyORMModule, DomainManagerModule],
  controllers: [LinkHubPublicController],
  providers: [LinkHubPublicService],
  exports: [LinkHubPublicService],
})
export class LinkHubModule {}
