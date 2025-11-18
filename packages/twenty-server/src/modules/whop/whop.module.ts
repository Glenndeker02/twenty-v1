import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { WhopWebhookController } from 'src/modules/whop/controllers/whop-webhook.controller';
import { WhopApiClientService } from 'src/modules/whop/services/whop-api-client.service';
import { WhopSyncService } from 'src/modules/whop/services/whop-sync.service';
import { WhopResolver } from 'src/modules/whop/whop.resolver';

@Module({
  imports: [HttpModule, TwentyORMModule],
  controllers: [WhopWebhookController],
  providers: [WhopApiClientService, WhopSyncService, WhopResolver],
  exports: [WhopApiClientService, WhopSyncService],
})
export class WhopModule {}
