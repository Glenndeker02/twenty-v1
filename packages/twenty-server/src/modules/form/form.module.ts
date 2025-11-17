import { Module } from '@nestjs/common';

import { FormPublicController } from 'src/modules/form/controllers/form-public.controller';
import { FormPublicService } from 'src/modules/form/services/form-public.service';
import { TwentyORMModule } from 'src/engine/twenty-orm/twenty-orm.module';
import { DomainManagerModule } from 'src/engine/core-modules/domain-manager/domain-manager.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';

@Module({
  imports: [TwentyORMModule, DomainManagerModule, ObjectMetadataModule],
  controllers: [FormPublicController],
  providers: [FormPublicService],
  exports: [FormPublicService],
})
export class FormModule {}
