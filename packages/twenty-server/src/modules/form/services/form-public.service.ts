import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { FormWorkspaceEntity } from 'src/modules/form/standard-objects/form.workspace-entity';
import { FormFieldWorkspaceEntity } from 'src/modules/form/standard-objects/form-field.workspace-entity';
import { FormSubmissionWorkspaceEntity } from 'src/modules/form/standard-objects/form-submission.workspace-entity';
import { TwentyORMGlobalManager } from 'src/engine/twenty-orm/twenty-orm-global.manager';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';

export interface FormPublicResponse {
  title: string;
  description: string | null;
  fields: FormFieldPublicResponse[];
  requireCaptcha: boolean;
  successMessage: string | null;
}

export interface FormFieldPublicResponse {
  id: string;
  targetFieldMetadataId: string;
  label: string;
  placeholder: string | null;
  helpText: string | null;
  isRequired: boolean;
  order: number;
  defaultValue: string | null;
  fieldType: string;
  fieldName: string;
}

export interface FormSubmissionRequest {
  data: Record<string, any>;
  captchaToken?: string;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  };
}

@Injectable()
export class FormPublicService {
  constructor(
    private readonly twentyORMGlobalManager: TwentyORMGlobalManager,
    private readonly objectMetadataService: ObjectMetadataService,
  ) {}

  async getByToken(
    token: string,
    workspaceId: string,
  ): Promise<FormPublicResponse> {
    const formRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<FormWorkspaceEntity>(
        workspaceId,
        'form',
      );

    const formFieldRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<FormFieldWorkspaceEntity>(
        workspaceId,
        'formField',
      );

    // Find the form by token
    const form = await formRepository.findOne({
      where: { shareToken: token, isActive: true },
    });

    if (!form) {
      throw new NotFoundException('Form not found or inactive');
    }

    // Increment view count
    await formRepository.update(form.id, {
      viewCount: form.viewCount + 1,
    });

    // Get all form fields ordered by their order field
    const formFields = await formFieldRepository.find({
      where: { formId: form.id },
      order: { order: 'ASC' },
    });

    // Get target object metadata to include field type information
    const objectMetadata =
      await this.objectMetadataService.findOneWithinWorkspace(workspaceId, {
        where: { id: form.targetObjectMetadataId },
      });

    if (!objectMetadata) {
      throw new NotFoundException('Target object not found');
    }

    // Get field metadata for each form field
    const fieldsWithMetadata = await Promise.all(
      formFields.map(async (formField) => {
        const fieldMetadata = objectMetadata.fields.find(
          (f) => f.id === formField.targetFieldMetadataId,
        );

        if (!fieldMetadata) {
          throw new NotFoundException(
            `Field metadata not found for field ${formField.targetFieldMetadataId}`,
          );
        }

        return {
          id: formField.id,
          targetFieldMetadataId: formField.targetFieldMetadataId,
          label: formField.label,
          placeholder: formField.placeholder,
          helpText: formField.helpText,
          isRequired: formField.isRequired,
          order: formField.order,
          defaultValue: formField.defaultValue,
          fieldType: fieldMetadata.type,
          fieldName: fieldMetadata.name,
        };
      }),
    );

    return {
      title: form.title,
      description: form.description,
      fields: fieldsWithMetadata,
      requireCaptcha: form.requireCaptcha,
      successMessage: form.successMessage,
    };
  }

  async submitForm(
    token: string,
    workspaceId: string,
    submission: FormSubmissionRequest,
  ): Promise<{ success: boolean; recordId?: string; redirectUrl?: string }> {
    const formRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<FormWorkspaceEntity>(
        workspaceId,
        'form',
      );

    const formFieldRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<FormFieldWorkspaceEntity>(
        workspaceId,
        'formField',
      );

    const formSubmissionRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace<FormSubmissionWorkspaceEntity>(
        workspaceId,
        'formSubmission',
      );

    // Find the form
    const form = await formRepository.findOne({
      where: { shareToken: token, isActive: true },
    });

    if (!form) {
      throw new NotFoundException('Form not found or inactive');
    }

    // Validate CAPTCHA if required
    if (form.requireCaptcha && !submission.captchaToken) {
      throw new BadRequestException('CAPTCHA validation required');
    }

    // TODO: Implement actual CAPTCHA validation
    // if (form.requireCaptcha) {
    //   const isValid = await this.validateCaptcha(submission.captchaToken);
    //   if (!isValid) {
    //     throw new ForbiddenException('Invalid CAPTCHA');
    //   }
    // }

    // Get form fields to validate required fields
    const formFields = await formFieldRepository.find({
      where: { formId: form.id },
    });

    // Validate required fields
    for (const field of formFields) {
      if (field.isRequired) {
        const fieldMetadata = await this.objectMetadataService.findOneWithinWorkspace(
          workspaceId,
          { where: { id: form.targetObjectMetadataId } },
        );

        if (!fieldMetadata) {
          throw new NotFoundException('Target object not found');
        }

        const targetField = fieldMetadata.fields.find(
          (f) => f.id === field.targetFieldMetadataId,
        );

        if (!targetField) {
          throw new NotFoundException('Target field not found');
        }

        const fieldValue = submission.data[targetField.name];

        if (
          fieldValue === undefined ||
          fieldValue === null ||
          fieldValue === ''
        ) {
          throw new BadRequestException(
            `Field "${field.label}" is required`,
          );
        }
      }
    }

    // Get the target object metadata
    const objectMetadata =
      await this.objectMetadataService.findOneWithinWorkspace(workspaceId, {
        where: { id: form.targetObjectMetadataId },
      });

    if (!objectMetadata) {
      throw new NotFoundException('Target object not found');
    }

    // Create record in target object
    const targetRepository =
      await this.twentyORMGlobalManager.getRepositoryForWorkspace(
        workspaceId,
        objectMetadata.nameSingular,
      );

    const createdRecord = await targetRepository.save(submission.data);

    // Save form submission record
    await formSubmissionRepository.save({
      formId: form.id,
      recordId: createdRecord.id,
      submittedData: submission.data,
      ipAddress: submission.metadata?.ipAddress || null,
      userAgent: submission.metadata?.userAgent || null,
      referrer: submission.metadata?.referrer || null,
    });

    // Increment submission count
    await formRepository.update(form.id, {
      submissionCount: form.submissionCount + 1,
    });

    return {
      success: true,
      recordId: createdRecord.id,
      redirectUrl: form.redirectUrl || undefined,
    };
  }

  // TODO: Implement CAPTCHA validation
  // private async validateCaptcha(token: string): Promise<boolean> {
  //   // Implement Google reCAPTCHA or hCaptcha validation
  //   return true;
  // }
}
