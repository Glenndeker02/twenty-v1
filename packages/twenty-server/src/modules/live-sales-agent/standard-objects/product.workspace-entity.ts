import { msg } from '@lingui/core/macro';
import {
  FieldMetadataType,
  RelationOnDeleteAction,
  ActorMetadata,
  type CurrencyMetadata,
} from 'twenty-shared/types';

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
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { PRODUCT_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import {
  type FieldTypeAndNameMetadata,
  getTsVectorColumnExpressionFromFields,
} from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
import { LiveSessionProductWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/live-session-product.workspace-entity';
import { LiveSessionLeadWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/live-session-lead.workspace-entity';

const NAME_FIELD_NAME = 'name';
const DESCRIPTION_FIELD_NAME = 'description';

export const SEARCH_FIELDS_FOR_PRODUCT: FieldTypeAndNameMetadata[] = [
  { name: NAME_FIELD_NAME, type: FieldMetadataType.TEXT },
  { name: DESCRIPTION_FIELD_NAME, type: FieldMetadataType.TEXT },
];

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.product,

  namePlural: 'products',
  labelSingular: msg`Product`,
  labelPlural: msg`Products`,
  description: msg`A product to sell during live sessions`,
  icon: STANDARD_OBJECT_ICONS.product,
  shortcut: 'P',
  labelIdentifierStandardId: PRODUCT_STANDARD_FIELD_IDS.name,
})
@WorkspaceIsSearchable()
export class ProductWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Product name`,
    icon: 'IconShoppingCart',
  })
  name: string;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Product description`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  description: string | null;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.price,
    type: FieldMetadataType.CURRENCY,
    label: msg`Price`,
    description: msg`Product price`,
    icon: 'IconCurrencyDollar',
  })
  @WorkspaceIsNullable()
  price: CurrencyMetadata | null;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.imageUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Image URL`,
    description: msg`Product image URL`,
    icon: 'IconPhoto',
  })
  @WorkspaceIsNullable()
  imageUrl: string | null;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.sku,
    type: FieldMetadataType.TEXT,
    label: msg`SKU`,
    description: msg`Product SKU`,
    icon: 'IconBarcode',
  })
  @WorkspaceIsNullable()
  sku: string | null;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.isActive,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Active`,
    description: msg`Whether the product is active`,
    icon: 'IconCheck',
    defaultValue: true,
  })
  @WorkspaceIsNullable()
  isActive: boolean;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.category,
    type: FieldMetadataType.TEXT,
    label: msg`Category`,
    description: msg`Product category`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  category: string | null;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.purchaseLink,
    type: FieldMetadataType.TEXT,
    label: msg`Purchase Link`,
    description: msg`Product purchase link`,
    icon: 'IconLink',
  })
  @WorkspaceIsNullable()
  purchaseLink: string | null;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Product record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceRelation({
    standardId: PRODUCT_STANDARD_FIELD_IDS.liveSessionProducts,
    label: msg`Live Session Products`,
    description: msg`Live sessions featuring this product`,
    icon: 'IconVideo',
    type: RelationType.ONE_TO_MANY,
    inverseSideTarget: () => LiveSessionProductWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  liveSessionProducts: Relation<LiveSessionProductWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: PRODUCT_STANDARD_FIELD_IDS.liveSessionLeads,
    label: msg`Live Session Leads`,
    description: msg`Leads interested in this product`,
    icon: 'IconUserPlus',
    type: RelationType.ONE_TO_MANY,
    inverseSideTarget: () => LiveSessionLeadWorkspaceEntity,
    inverseSideFieldKey: 'product',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  liveSessionLeads: Relation<LiveSessionLeadWorkspaceEntity[]>;

  @WorkspaceField({
    standardId: PRODUCT_STANDARD_FIELD_IDS.searchVector,
    type: FieldMetadataType.TS_VECTOR,
    label: SEARCH_VECTOR_FIELD.label,
    description: SEARCH_VECTOR_FIELD.description,
    icon: 'IconUser',
    generatedType: 'STORED',
    asExpression: getTsVectorColumnExpressionFromFields(
      SEARCH_FIELDS_FOR_PRODUCT,
    ),
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  @WorkspaceFieldIndex({ indexType: IndexType.GIN })
  searchVector: string;
}
