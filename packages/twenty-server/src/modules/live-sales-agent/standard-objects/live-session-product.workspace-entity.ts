import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { LIVE_SESSION_PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { LiveSessionWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/live-session.workspace-entity';
import { ProductWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/product.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.liveSessionProduct,

  namePlural: 'liveSessionProducts',
  labelSingular: msg`Live Session Product`,
  labelPlural: msg`Live Session Products`,
  description: msg`Products featured in a live session`,
  icon: STANDARD_OBJECT_ICONS.liveSessionProduct,
})
export class LiveSessionProductWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceRelation({
    standardId: LIVE_SESSION_PRODUCT_STANDARD_FIELD_IDS.liveSession,
    type: RelationType.MANY_TO_ONE,
    label: msg`Live Session`,
    description: msg`The live session`,
    icon: 'IconVideo',
    inverseSideTarget: () => LiveSessionWorkspaceEntity,
    inverseSideFieldKey: 'liveSessionProducts',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  liveSession: Relation<LiveSessionWorkspaceEntity>;

  @WorkspaceJoinColumn('liveSession')
  liveSessionId: string;

  @WorkspaceRelation({
    standardId: LIVE_SESSION_PRODUCT_STANDARD_FIELD_IDS.product,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product`,
    description: msg`The product`,
    icon: 'IconShoppingCart',
    inverseSideTarget: () => ProductWorkspaceEntity,
    inverseSideFieldKey: 'liveSessionProducts',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  product: Relation<ProductWorkspaceEntity>;

  @WorkspaceJoinColumn('product')
  productId: string;

  @WorkspaceField({
    standardId: LIVE_SESSION_PRODUCT_STANDARD_FIELD_IDS.mentionCount,
    type: FieldMetadataType.NUMBER,
    label: msg`Mention Count`,
    description: msg`Number of times product was mentioned in chat`,
    icon: 'IconHash',
    defaultValue: 0,
  })
  mentionCount: number;

  @WorkspaceField({
    standardId: LIVE_SESSION_PRODUCT_STANDARD_FIELD_IDS.linkClickCount,
    type: FieldMetadataType.NUMBER,
    label: msg`Link Click Count`,
    description: msg`Number of times product link was clicked`,
    icon: 'IconClick',
    defaultValue: 0,
  })
  linkClickCount: number;

  @WorkspaceField({
    standardId: LIVE_SESSION_PRODUCT_STANDARD_FIELD_IDS.conversionCount,
    type: FieldMetadataType.NUMBER,
    label: msg`Conversion Count`,
    description: msg`Number of conversions/purchases`,
    icon: 'IconShoppingCartCheck',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  conversionCount: number | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_PRODUCT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;
}
