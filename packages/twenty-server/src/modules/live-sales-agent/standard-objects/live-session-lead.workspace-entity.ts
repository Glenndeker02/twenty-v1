import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { LIVE_SESSION_LEAD_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { LiveSessionWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/live-session.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { ProductWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/product.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.liveSessionLead,

  namePlural: 'liveSessionLeads',
  labelSingular: msg`Live Session Lead`,
  labelPlural: msg`Live Session Leads`,
  description: msg`Leads captured during a live session`,
  icon: STANDARD_OBJECT_ICONS.liveSessionLead,
})
export class LiveSessionLeadWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceRelation({
    standardId: LIVE_SESSION_LEAD_STANDARD_FIELD_IDS.liveSession,
    type: RelationType.MANY_TO_ONE,
    label: msg`Live Session`,
    description: msg`The live session where the lead was captured`,
    icon: 'IconVideo',
    inverseSideTarget: () => LiveSessionWorkspaceEntity,
    inverseSideFieldKey: 'liveSessionLeads',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  liveSession: Relation<LiveSessionWorkspaceEntity>;

  @WorkspaceJoinColumn('liveSession')
  liveSessionId: string;

  @WorkspaceRelation({
    standardId: LIVE_SESSION_LEAD_STANDARD_FIELD_IDS.person,
    type: RelationType.MANY_TO_ONE,
    label: msg`Person`,
    description: msg`The person/contact`,
    icon: 'IconUser',
    inverseSideTarget: () => PersonWorkspaceEntity,
    inverseSideFieldKey: 'liveSessionLeads',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  person: Relation<PersonWorkspaceEntity> | null;

  @WorkspaceJoinColumn('person')
  personId: string | null;

  @WorkspaceRelation({
    standardId: LIVE_SESSION_LEAD_STANDARD_FIELD_IDS.product,
    type: RelationType.MANY_TO_ONE,
    label: msg`Product`,
    description: msg`The product the lead is interested in`,
    icon: 'IconShoppingCart',
    inverseSideTarget: () => ProductWorkspaceEntity,
    inverseSideFieldKey: 'liveSessionLeads',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  product: Relation<ProductWorkspaceEntity> | null;

  @WorkspaceJoinColumn('product')
  productId: string | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_LEAD_STANDARD_FIELD_IDS.leadScore,
    type: FieldMetadataType.NUMBER,
    label: msg`Lead Score`,
    description: msg`Score indicating lead quality (0-100)`,
    icon: 'IconStar',
    defaultValue: 50,
  })
  @WorkspaceIsNullable()
  leadScore: number | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_LEAD_STANDARD_FIELD_IDS.leadStatus,
    type: FieldMetadataType.SELECT,
    label: msg`Lead Status`,
    description: msg`Current status of the lead`,
    icon: 'IconProgress',
    options: [
      { value: 'NEW', label: 'New', position: 0, color: 'blue' },
      { value: 'CONTACTED', label: 'Contacted', position: 1, color: 'yellow' },
      { value: 'QUALIFIED', label: 'Qualified', position: 2, color: 'green' },
      { value: 'CONVERTED', label: 'Converted', position: 3, color: 'purple' },
      { value: 'LOST', label: 'Lost', position: 4, color: 'red' },
    ],
    defaultValue: "'NEW'",
  })
  @WorkspaceFieldIndex()
  leadStatus: string;

  @WorkspaceField({
    standardId: LIVE_SESSION_LEAD_STANDARD_FIELD_IDS.notes,
    type: FieldMetadataType.TEXT,
    label: msg`Notes`,
    description: msg`Additional notes about the lead`,
    icon: 'IconNotes',
  })
  @WorkspaceIsNullable()
  notes: string | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_LEAD_STANDARD_FIELD_IDS.capturedAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Captured At`,
    description: msg`When the lead was captured`,
    icon: 'IconCalendarEvent',
  })
  @WorkspaceIsNullable()
  capturedAt: Date | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_LEAD_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;
}
