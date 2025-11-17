import { msg } from '@lingui/core/macro';
import { FieldMetadataType, ActorMetadata } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { FORM_SUBMISSION_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { RelationOnDeleteAction } from 'twenty-shared/types';
import { FormWorkspaceEntity } from 'src/modules/form/standard-objects/form.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.formSubmission,
  namePlural: 'formSubmissions',
  labelSingular: msg`Form Submission`,
  labelPlural: msg`Form Submissions`,
  description: msg`A submission to a form`,
  icon: 'IconFileCheck',
  labelIdentifierStandardId: FORM_SUBMISSION_STANDARD_FIELD_IDS.recordId,
})
export class FormSubmissionWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: FORM_SUBMISSION_STANDARD_FIELD_IDS.recordId,
    type: FieldMetadataType.TEXT,
    label: msg`Record ID`,
    description: msg`ID of the created record`,
    icon: 'IconDatabase',
  })
  @WorkspaceIsNullable()
  recordId: string | null;

  @WorkspaceField({
    standardId: FORM_SUBMISSION_STANDARD_FIELD_IDS.submittedData,
    type: FieldMetadataType.RAW_JSON,
    label: msg`Submitted Data`,
    description: msg`The data that was submitted`,
    icon: 'IconJson',
  })
  @WorkspaceIsNullable()
  submittedData: Record<string, any> | null;

  @WorkspaceField({
    standardId: FORM_SUBMISSION_STANDARD_FIELD_IDS.ipAddress,
    type: FieldMetadataType.TEXT,
    label: msg`IP Address`,
    description: msg`IP address of the submitter`,
    icon: 'IconNetwork',
  })
  @WorkspaceIsNullable()
  ipAddress: string | null;

  @WorkspaceField({
    standardId: FORM_SUBMISSION_STANDARD_FIELD_IDS.userAgent,
    type: FieldMetadataType.TEXT,
    label: msg`User Agent`,
    description: msg`Browser/device information`,
    icon: 'IconDeviceDesktop',
  })
  @WorkspaceIsNullable()
  userAgent: string | null;

  @WorkspaceField({
    standardId: FORM_SUBMISSION_STANDARD_FIELD_IDS.referrer,
    type: FieldMetadataType.TEXT,
    label: msg`Referrer`,
    description: msg`URL that referred to this form`,
    icon: 'IconExternalLink',
  })
  @WorkspaceIsNullable()
  referrer: string | null;

  @WorkspaceField({
    standardId: FORM_SUBMISSION_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Form submission record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: FORM_SUBMISSION_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: FORM_SUBMISSION_STANDARD_FIELD_IDS.form,
    type: RelationType.MANY_TO_ONE,
    label: msg`Form`,
    description: msg`The form this submission belongs to`,
    icon: 'IconForms',
    inverseSideTarget: () => FormWorkspaceEntity,
    inverseSideFieldKey: 'formSubmissions',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  form: Relation<FormWorkspaceEntity>;

  @WorkspaceJoinColumn('form')
  formId: string;
}
