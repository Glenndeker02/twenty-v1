import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/engine/guards/jwt.auth.guard';
import { ContractProviderService } from 'src/modules/contract/services/contract-provider.service';

@Resolver()
@UseGuards(JwtAuthGuard)
export class ContractResolver {
  constructor(private readonly contractProviderService: ContractProviderService) {}

  @Mutation(() => String)
  async sendContract(
    @Args('templateId') templateId: string,
    @Args('signers') signers: string, // JSON string
    @Args('subject') subject: string,
    @Args('message', { nullable: true }) message?: string,
  ): Promise<string> {
    const signersData = JSON.parse(signers);
    const contract = await this.contractProviderService.sendContract({
      templateId,
      signers: signersData,
      subject,
      message,
      expiresInDays: 30,
    });
    return JSON.stringify(contract);
  }

  @Mutation(() => String)
  async getContractStatus(@Args('contractId') contractId: string): Promise<string> {
    const status = await this.contractProviderService.getContractStatus(contractId);
    return status;
  }

  @Mutation(() => Boolean)
  async cancelContract(@Args('contractId') contractId: string): Promise<boolean> {
    return await this.contractProviderService.cancelContract(contractId);
  }
}
