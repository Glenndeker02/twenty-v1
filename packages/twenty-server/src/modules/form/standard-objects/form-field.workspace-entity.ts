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
import { FORM_FIELD_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { RelationOnDeleteAction } from 'twenty-shared/types';
import { FormWorkspaceEntity } from 'src/modules/form/standard-objects/form.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.formField,
  namePlural: 'formFields',
  labelSingular: msg`Form Field`,
  labelPlural: msg`Form Fields`,
  description: msg`A field in a form`,
  icon: 'IconInputField',
  labelIdentifierStandardId: FORM_FIELD_STANDARD_FIELD_IDS.label,
})
export class FormFieldWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.targetFieldMetadataId,
    type: FieldMetadataType.TEXT,
    label: msg`Target Field`,
    description: msg`The field in the target object to map this form field to`,
    icon: 'IconDatabase',
  })
  targetFieldMetadataId: string;

  @WorkspaceField({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.label,
    type: FieldMetadataType.TEXT,
    label: msg`Label`,
    description: msg`Label shown to users`,
    icon: 'IconTag',
  })
  label: string;

  @WorkspaceField({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.placeholder,
    type: FieldMetadataType.TEXT,
    label: msg`Placeholder`,
    description: msg`Placeholder text for the field`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  placeholder: string | null;

  @WorkspaceField({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.helpText,
    type: FieldMetadataType.TEXT,
    label: msg`Help Text`,
    description: msg`Additional help text shown below the field`,
    icon: 'IconHelp',
  })
  @WorkspaceIsNullable()
  helpText: string | null;

  @WorkspaceField({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.isRequired,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Is Required`,
    description: msg`Whether this field is required`,
    icon: 'IconAsterisk',
    defaultValue: false,
  })
  isRequired: boolean;

  @WorkspaceField({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.order,
    type: FieldMetadataType.NUMBER,
    label: msg`Order`,
    description: msg`Display order (lower numbers first)`,
    icon: 'IconList',
    defaultValue: 0,
  })
  order: number;

  @WorkspaceField({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.defaultValue,
    type: FieldMetadataType.TEXT,
    label: msg`Default Value`,
    description: msg`Default value for the field`,
    icon: 'IconWriting',
  })
  @WorkspaceIsNullable()
  defaultValue: string | null;

  @WorkspaceField({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Form field record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: FORM_FIELD_STANDARD_FIELD_IDS.form,
    type: RelationType.MANY_TO_ONE,
    label: msg`Form`,
    description: msg`The form this field belongs to`,
    icon: 'IconForms',
    inverseSideTarget: () => FormWorkspaceEntity,
    inverseSideFieldKey: 'formFields',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  form: Relation<FormWorkspaceEntity>;

  @WorkspaceJoinColumn('form')
  formId: string;
}
