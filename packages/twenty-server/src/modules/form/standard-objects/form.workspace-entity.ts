import { msg } from '@lingui/core/macro';
import { FieldMetadataType, ActorMetadata } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { SEARCH_VECTOR_FIELD } from 'src/engine/metadata-modules/constants/search-vector-field.constants';
import { IndexType } from 'src/engine/metadata-modules/index-metadata/types/indexType.types';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSearchable } from 'src/engine/twenty-orm/decorators/workspace-is-searchable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceIsUnique } from 'src/engine/twenty-orm/decorators/workspace-is-unique.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { FORM_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { RelationOnDeleteAction } from 'twenty-shared/types';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { FormFieldWorkspaceEntity } from 'src/modules/form/standard-objects/form-field.workspace-entity';
import { FormSubmissionWorkspaceEntity } from 'src/modules/form/standard-objects/form-submission.workspace-entity';

const TITLE_FIELD_NAME = 'title';
const DESCRIPTION_FIELD_NAME = 'description';

export const SEARCH_FIELDS_FOR_FORM: FieldTypeAndNameMetadata[] = [
  { name: TITLE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: DESCRIPTION_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.form,
  namePlural: 'forms',
  labelSingular: msg`Form`,
  labelPlural: msg`Forms`,
  description: msg`A public form for collecting data`,
  icon: 'IconForms',
  labelIdentifierStandardId: FORM_STANDARD_FIELD_IDS.title,
})
@WorkspaceIsSearchable()
export class FormWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: msg`Title`,
    description: msg`Title of the form`,
    icon: 'IconTag',
  })
  title: string;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Description of the form`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  description: string | null;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.shareToken,
    type: FieldMetadataType.TEXT,
    label: msg`Share Token`,
    description: msg`Unique token for public sharing`,
    icon: 'IconKey',
  })
  @WorkspaceIsUnique()
  @WorkspaceIsSystem()
  shareToken: string;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.targetObjectMetadataId,
    type: FieldMetadataType.TEXT,
    label: msg`Target Object`,
    description: msg`The object that form submissions will create records in`,
    icon: 'IconDatabase',
  })
  targetObjectMetadataId: string;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.isActive,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Is Active`,
    description: msg`Whether the form accepts submissions`,
    icon: 'IconEye',
    defaultValue: true,
  })
  isActive: boolean;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.successMessage,
    type: FieldMetadataType.TEXT,
    label: msg`Success Message`,
    description: msg`Message shown after successful submission`,
    icon: 'IconCheck',
  })
  @WorkspaceIsNullable()
  successMessage: string | null;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.redirectUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Redirect URL`,
    description: msg`URL to redirect to after successful submission`,
    icon: 'IconExternalLink',
  })
  @WorkspaceIsNullable()
  redirectUrl: string | null;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.requireCaptcha,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Require CAPTCHA`,
    description: msg`Whether to require CAPTCHA verification`,
    icon: 'IconShieldCheck',
    defaultValue: false,
  })
  requireCaptcha: boolean;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.submissionCount,
    type: FieldMetadataType.NUMBER,
    label: msg`Submission Count`,
    description: msg`Number of form submissions`,
    icon: 'IconFileCheck',
    defaultValue: 0,
  })
  @WorkspaceIsFieldUIReadOnly()
  submissionCount: number;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.viewCount,
    type: FieldMetadataType.NUMBER,
    label: msg`View Count`,
    description: msg`Number of times this form has been viewed`,
    icon: 'IconEye',
    defaultValue: 0,
  })
  @WorkspaceIsFieldUIReadOnly()
  viewCount: number;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.allowMultipleSubmissions,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Allow Multiple Submissions`,
    description: msg`Whether users can submit multiple times`,
    icon: 'IconRepeat',
    defaultValue: true,
  })
  allowMultipleSubmissions: boolean;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Form record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: FORM_STANDARD_FIELD_IDS.formFields,
    type: RelationType.ONE_TO_MANY,
    label: msg`Form Fields`,
    description: msg`Fields in this form`,
    icon: 'IconInputField',
    inverseSideTarget: () => FormFieldWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  formFields: Relation<FormFieldWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: FORM_STANDARD_FIELD_IDS.formSubmissions,
    type: RelationType.ONE_TO_MANY,
    label: msg`Form Submissions`,
    description: msg`Submissions to this form`,
    icon: 'IconFileCheck',
    inverseSideTarget: () => FormSubmissionWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  formSubmissions: Relation<FormSubmissionWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: FORM_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(SEARCH_FIELDS_FOR_FORM),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}
