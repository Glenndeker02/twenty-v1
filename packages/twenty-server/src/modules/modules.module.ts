import { Module } from '@nestjs/common';

import { AIModule } from 'src/modules/ai/ai.module';
import { CalendarModule } from 'src/modules/calendar/calendar.module';
import { ConnectedAccountModule } from 'src/modules/connected-account/connected-account.module';
import { ContractModule } from 'src/modules/contract/contract.module';
import { FavoriteFolderModule } from 'src/modules/favorite-folder/favorite-folder.module';
import { FavoriteModule } from 'src/modules/favorite/favorite.module';
import { MessagingModule } from 'src/modules/messaging/messaging.module';
import { WhopModule } from 'src/modules/whop/whop.module';
import { WorkflowModule } from 'src/modules/workflow/workflow.module';

@Module({
  imports: [
    MessagingModule,
    CalendarModule,
    ConnectedAccountModule,
    WorkflowModule,
    FavoriteFolderModule,
    FavoriteModule,
    WhopModule,
    AIModule,
    ContractModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
