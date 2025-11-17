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
import { LINK_HUB_ITEM_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { RelationOnDeleteAction } from 'twenty-shared/types';
import { LinkHubWorkspaceEntity } from 'src/modules/link-hub/standard-objects/link-hub.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.linkHubItem,
  namePlural: 'linkHubItems',
  labelSingular: msg`Link Hub Item`,
  labelPlural: msg`Link Hub Items`,
  description: msg`Individual link/button in a link hub`,
  icon: 'IconExternalLink',
  labelIdentifierStandardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.title,
})
export class LinkHubItemWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: msg`Title`,
    description: msg`Title of the link`,
    icon: 'IconTag',
  })
  title: string;

  @WorkspaceField({
    standardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.url,
    type: FieldMetadataType.TEXT,
    label: msg`URL`,
    description: msg`Destination URL`,
    icon: 'IconLink',
  })
  url: string;

  @WorkspaceField({
    standardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.icon,
    type: FieldMetadataType.TEXT,
    label: msg`Icon`,
    description: msg`Icon name or emoji for the link`,
    icon: 'IconIcons',
  })
  @WorkspaceIsNullable()
  icon: string | null;

  @WorkspaceField({
    standardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.order,
    type: FieldMetadataType.NUMBER,
    label: msg`Order`,
    description: msg`Display order (lower numbers first)`,
    icon: 'IconList',
    defaultValue: 0,
  })
  order: number;

  @WorkspaceField({
    standardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.isVisible,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Is Visible`,
    description: msg`Whether the link is visible on the hub`,
    icon: 'IconEye',
    defaultValue: true,
  })
  isVisible: boolean;

  @WorkspaceField({
    standardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.clickCount,
    type: FieldMetadataType.NUMBER,
    label: msg`Click Count`,
    description: msg`Number of times this link has been clicked`,
    icon: 'IconClick',
    defaultValue: 0,
  })
  @WorkspaceIsFieldUIReadOnly()
  clickCount: number;

  @WorkspaceField({
    standardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Link hub item record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  // Relations
  @WorkspaceRelation({
    standardId: LINK_HUB_ITEM_STANDARD_FIELD_IDS.linkHub,
    type: RelationType.MANY_TO_ONE,
    label: msg`Link Hub`,
    description: msg`The link hub this item belongs to`,
    icon: 'IconLink',
    inverseSideTarget: () => LinkHubWorkspaceEntity,
    inverseSideFieldKey: 'linkHubItems',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  linkHub: Relation<LinkHubWorkspaceEntity>;

  @WorkspaceJoinColumn('linkHub')
  linkHubId: string;
}
