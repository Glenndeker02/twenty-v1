import { Module } from '@nestjs/common';

import { AIProviderService } from 'src/modules/ai/services/ai-provider.service';
import { AIResolver } from 'src/modules/ai/ai.resolver';

@Module({
  providers: [AIProviderService, AIResolver],
  exports: [AIProviderService],
})
export class AIModule {}
