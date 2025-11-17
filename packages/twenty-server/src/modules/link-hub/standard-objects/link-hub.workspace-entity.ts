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
import { LINK_HUB_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { RelationOnDeleteAction } from 'twenty-shared/types';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { LinkHubItemWorkspaceEntity } from 'src/modules/link-hub/standard-objects/link-hub-item.workspace-entity';

const TITLE_FIELD_NAME = 'title';
const DESCRIPTION_FIELD_NAME = 'description';

export const SEARCH_FIELDS_FOR_LINK_HUB: FieldTypeAndNameMetadata[] = [
  { name: TITLE_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: DESCRIPTION_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.linkHub,
  namePlural: 'linkHubs',
  labelSingular: msg`Link Hub`,
  labelPlural: msg`Link Hubs`,
  description: msg`A public link hub page (Linktree-style)`,
  icon: 'IconLink',
  labelIdentifierStandardId: LINK_HUB_STANDARD_FIELD_IDS.title,
})
@WorkspaceIsSearchable()
export class LinkHubWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: msg`Title`,
    description: msg`Title of the link hub`,
    icon: 'IconTag',
  })
  title: string;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.slug,
    type: FieldMetadataType.TEXT,
    label: msg`Slug`,
    description: msg`URL slug for the link hub (e.g., "my-links")`,
    icon: 'IconLink',
  })
  @WorkspaceIsUnique()
  slug: string;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Description of the link hub`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  description: string | null;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.avatarUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Avatar URL`,
    description: msg`Avatar image URL for the link hub`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  avatarUrl: string | null;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.backgroundColor,
    type: FieldMetadataType.TEXT,
    label: msg`Background Color`,
    description: msg`Background color for the link hub page`,
    icon: 'IconPalette',
    defaultValue: '#ffffff',
  })
  backgroundColor: string;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.textColor,
    type: FieldMetadataType.TEXT,
    label: msg`Text Color`,
    description: msg`Text color for the link hub page`,
    icon: 'IconPalette',
    defaultValue: '#000000',
  })
  textColor: string;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.isActive,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Is Active`,
    description: msg`Whether the link hub is publicly visible`,
    icon: 'IconEye',
    defaultValue: true,
  })
  isActive: boolean;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.viewCount,
    type: FieldMetadataType.NUMBER,
    label: msg`View Count`,
    description: msg`Number of times this link hub has been viewed`,
    icon: 'IconEye',
    defaultValue: 0,
  })
  @WorkspaceIsFieldUIReadOnly()
  viewCount: number;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.shareToken,
    type: FieldMetadataType.TEXT,
    label: msg`Share Token`,
    description: msg`Unique token for public sharing`,
    icon: 'IconKey',
  })
  @WorkspaceIsUnique()
  @WorkspaceIsSystem()
  shareToken: string;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.customDomain,
    type: FieldMetadataType.TEXT,
    label: msg`Custom Domain`,
    description: msg`Optional custom domain for the link hub`,
    icon: 'IconWorld',
  })
  @WorkspaceIsNullable()
  customDomain: string | null;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Link hub record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.linkHubItems,
    type: RelationType.ONE_TO_MANY,
    label: msg`Link Items`,
    description: msg`Links in this hub`,
    icon: 'IconLink',
    inverseSideTarget: () => LinkHubItemWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  linkHubItems: Relation<LinkHubItemWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: LINK_HUB_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_LINK_HUB,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}
