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
import { LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { LiveSessionWorkspaceEntity } from 'src/modules/live-sales-agent/standard-objects/live-session.workspace-entity';
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.liveSessionInteraction,

  namePlural: 'liveSessionInteractions',
  labelSingular: msg`Live Session Interaction`,
  labelPlural: msg`Live Session Interactions`,
  description: msg`Chat interactions during a live session`,
  icon: STANDARD_OBJECT_ICONS.liveSessionInteraction,
})
export class LiveSessionInteractionWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceRelation({
    standardId: LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS.liveSession,
    type: RelationType.MANY_TO_ONE,
    label: msg`Live Session`,
    description: msg`The live session`,
    icon: 'IconVideo',
    inverseSideTarget: () => LiveSessionWorkspaceEntity,
    inverseSideFieldKey: 'liveSessionInteractions',
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  liveSession: Relation<LiveSessionWorkspaceEntity>;

  @WorkspaceJoinColumn('liveSession')
  liveSessionId: string;

  @WorkspaceRelation({
    standardId: LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS.person,
    type: RelationType.MANY_TO_ONE,
    label: msg`Person`,
    description: msg`The person who interacted`,
    icon: 'IconUser',
    inverseSideTarget: () => PersonWorkspaceEntity,
    inverseSideFieldKey: 'liveSessionInteractions',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  person: Relation<PersonWorkspaceEntity> | null;

  @WorkspaceJoinColumn('person')
  personId: string | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS.platformUsername,
    type: FieldMetadataType.TEXT,
    label: msg`Platform Username`,
    description: msg`Username on the streaming platform`,
    icon: 'IconAt',
  })
  platformUsername: string;

  @WorkspaceField({
    standardId: LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS.userMessage,
    type: FieldMetadataType.TEXT,
    label: msg`User Message`,
    description: msg`Message from the user`,
    icon: 'IconMessage',
  })
  @WorkspaceIsNullable()
  userMessage: string | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS.agentResponse,
    type: FieldMetadataType.TEXT,
    label: msg`Agent Response`,
    description: msg`Response from the AI agent`,
    icon: 'IconRobot',
  })
  @WorkspaceIsNullable()
  agentResponse: string | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS.intent,
    type: FieldMetadataType.SELECT,
    label: msg`Intent`,
    description: msg`Detected intent of the message`,
    icon: 'IconBulb',
    options: [
      {
        value: 'PRODUCT_INQUIRY',
        label: 'Product Inquiry',
        position: 0,
        color: 'blue',
      },
      {
        value: 'PURCHASE_INTENT',
        label: 'Purchase Intent',
        position: 1,
        color: 'green',
      },
      {
        value: 'GENERAL_QUESTION',
        label: 'General Question',
        position: 2,
        color: 'yellow',
      },
      { value: 'COMPLAINT', label: 'Complaint', position: 3, color: 'red' },
      { value: 'PRAISE', label: 'Praise', position: 4, color: 'purple' },
      { value: 'OTHER', label: 'Other', position: 5, color: 'gray' },
    ],
    defaultValue: "'OTHER'",
  })
  @WorkspaceFieldIndex()
  intent: string;

  @WorkspaceField({
    standardId: LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS.wasAutoResponded,
    type: FieldMetadataType.BOOLEAN,
    label: msg`Auto Responded`,
    description: msg`Whether the agent automatically responded`,
    icon: 'IconRobot',
    defaultValue: false,
  })
  wasAutoResponded: boolean;

  @WorkspaceField({
    standardId: LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS.responseTimestamp,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Response Timestamp`,
    description: msg`When the agent responded`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  responseTimestamp: Date | null;

  @WorkspaceField({
    standardId: LIVE_SESSION_INTERACTION_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;
}
