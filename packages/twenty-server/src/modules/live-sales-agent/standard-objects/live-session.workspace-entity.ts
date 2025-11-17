import { msg } from '@lingui/core/macro';
import { FieldMetadataType, RelationOnDeleteAction, ActorMetadata } from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceFieldIndex } from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSearchable } from 'src/engine/twenty-orm/decorators/workspace-is-searchable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { LIVE_SESSION_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { LiveSessionProductWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/live-session-product.workspace-entity';
import { LiveSessionInteractionWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/live-session-interaction.workspace-entity';
import { LiveSessionLeadWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/live-session-lead.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.liveSession,

  namePlural: 'liveSessions',
  labelSingular: msg`Live Session`,
  labelPlural: msg`Live Sessions`,
  description: msg`A live streaming session`,
  icon: STANDARD_OBJECT_ICONS.liveSession,
  shortcut: 'L',
  labelIdentifierStandardId: LIVE_SESSION_STANDARD_FIELD_IDS.title,
})
@WorkspaceIsSearchable()
export class LiveSessionWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.platform,
    type: FieldMetadataType.SELECT,
    label: msg`Platform`,
    description: msg`Streaming platform`,
    icon: 'IconBroadcast',
    options: [
      { value: 'YOUTUBE', label: 'YouTube', position: 0, color: 'red' },
      { value: 'TWITCH', label: 'Twitch', position: 1, color: 'purple' },
      { value: 'INSTAGRAM', label: 'Instagram', position: 2, color: 'pink' },
      { value: 'TIKTOK', label: 'TikTok', position: 3, color: 'sky' },
      { value: 'FACEBOOK', label: 'Facebook', position: 4, color: 'blue' },
    ],
    defaultValue: "'YOUTUBE'",
  })
  @WorkspaceFieldIndex()
  platform: string;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.platformStreamId,
    type: FieldMetadataType.TEXT,
    label: msg`Platform Stream ID`,
    description: msg`Unique identifier from the streaming platform`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  platformStreamId: string | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Live session status`,
    icon: 'IconProgress',
    options: [
      { value: 'SCHEDULED', label: 'Scheduled', position: 0, color: 'blue' },
      { value: 'LIVE', label: 'Live', position: 1, color: 'green' },
      { value: 'ENDED', label: 'Ended', position: 2, color: 'gray' },
      { value: 'CANCELLED', label: 'Cancelled', position: 3, color: 'red' },
    ],
    defaultValue: "'SCHEDULED'",
  })
  @WorkspaceFieldIndex()
  status: string;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.startTime,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Start Time`,
    description: msg`When the live session started`,
    icon: 'IconCalendarEvent',
  })
  @WorkspaceIsNullable()
  startTime: Date | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.endTime,
    type: FieldMetadataType.DATE_TIME,
    label: msg`End Time`,
    description: msg`When the live session ended`,
    icon: 'IconCalendarEvent',
  })
  @WorkspaceIsNullable()
  endTime: Date | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.title,
    type: FieldMetadataType.TEXT,
    label: msg`Title`,
    description: msg`Live session title`,
    icon: 'IconHeading',
  })
  title: string;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.totalViewers,
    type: FieldMetadataType.NUMBER,
    label: msg`Total Viewers`,
    description: msg`Total number of viewers`,
    icon: 'IconEye',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  totalViewers: number | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.peakViewers,
    type: FieldMetadataType.NUMBER,
    label: msg`Peak Viewers`,
    description: msg`Peak concurrent viewers`,
    icon: 'IconTrendingUp',
    defaultValue: 0,
  })
  @WorkspaceIsNullable()
  peakViewers: number | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.agentEnabled,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Agent Enabled`,
    description: msg`Whether the AI agent is enabled for this session`,
    icon: 'IconRobot',
    defaultValue: true,
  })
  agentEnabled: boolean;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Live session record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceRelation({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.liveSessionProducts,
    label: msg`Products`,
    description: msg`Products featured in this live session`,
    icon: 'IconShoppingCart',
    type: RelationType.ONE_TO_MANY,
    inverseSideTarget: () => LiveSessionProductWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  liveSessionProducts: Relation<LiveSessionProductWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.liveSessionInteractions,
    label: msg`Interactions`,
    description: msg`Chat interactions during this live session`,
    icon: 'IconMessageDots',
    type: RelationType.ONE_TO_MANY,
    inverseSideTarget: () => LiveSessionInteractionWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  liveSessionInteractions: Relation<LiveSessionInteractionWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: LIVE_SESSION_STANDARD_FIELD_IDS.liveSessionLeads,
    label: msg`Leads`,
    description: msg`Leads captured during this live session`,
    icon: 'IconUserPlus',
    type: RelationType.ONE_TO_MANY,
    inverseSideTarget: () => LiveSessionLeadWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  liveSessionLeads: Relation<LiveSessionLeadWorkspaceEntity[]>;
}
