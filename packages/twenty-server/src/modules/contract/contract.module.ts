import { Module } from '@nestjs/common';

import { ContractProviderService } from 'src/modules/contract/services/contract-provider.service';
import { ContractResolver } from 'src/modules/contract/contract.resolver';

@Module({
  providers: [ContractProviderService, ContractResolver],
  exports: [ContractProviderService],
})
export class ContractModule {}
