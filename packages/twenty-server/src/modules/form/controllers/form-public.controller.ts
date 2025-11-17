import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Headers,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import {
  FormPublicService,
  FormSubmissionRequest,
} from 'src/modules/form/services/form-public.service';
import { DomainManagerService } from 'src/engine/core-modules/domain-manager/services/domain-manager.service';

@Controller('forms')
@UseGuards(PublicEndpointGuard, NoPermissionGuard)
export class FormPublicController {
  constructor(
    private readonly formPublicService: FormPublicService,
    private readonly domainManagerService: DomainManagerService,
  ) {}

  @Get(':token')
  async getForm(
    @Param('token') token: string,
    @Headers('host') host: string,
  ) {
    const workspaceId =
      await this.domainManagerService.getWorkspaceIdByOrigin(host);

    if (!workspaceId) {
      throw new NotFoundException('Workspace not found');
    }

    return await this.formPublicService.getByToken(token, workspaceId);
  }

  @Post(':token/submit')
  async submitForm(
    @Param('token') token: string,
    @Headers('host') host: string,
    @Body() body: { data: Record<string, any>; captchaToken?: string },
    @Req() req: Request,
  ) {
    const workspaceId =
      await this.domainManagerService.getWorkspaceIdByOrigin(host);

    if (!workspaceId) {
      throw new NotFoundException('Workspace not found');
    }

    const submission: FormSubmissionRequest = {
      data: body.data,
      captchaToken: body.captchaToken,
      metadata: {
        ipAddress:
          (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
          req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        referrer: req.headers['referer'] || req.headers['referrer'],
      },
    };

    return await this.formPublicService.submitForm(
      token,
      workspaceId,
      submission,
    );
  }
}
