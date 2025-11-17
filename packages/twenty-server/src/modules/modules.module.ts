import { Module } from '@nestjs/common';

import { CalendarModule } from 'src/modules/calendar/calendar.module';
import { ConnectedAccountModule } from 'src/modules/connected-account/connected-account.module';
import { FavoriteFolderModule } from 'src/modules/favorite-folder/favorite-folder.module';
import { FavoriteModule } from 'src/modules/favorite/favorite.module';
import { MarketingAiAgentModule } from 'src/modules/marketing-ai-agent/marketing-ai-agent.module';
import { MessagingModule } from 'src/modules/messaging/messaging.module';
import { WorkflowModule } from 'src/modules/workflow/workflow.module';

@Module({
  imports: [
    MessagingModule,
    CalendarModule,
    ConnectedAccountModule,
    WorkflowModule,
    FavoriteFolderModule,
    FavoriteModule,
    MarketingAiAgentModule,
  ],
  providers: [],
  exports: [],
})
export class ModulesModule {}
