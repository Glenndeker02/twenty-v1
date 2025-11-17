import { msg } from '@lingui/core/macro';
import {
  FieldMetadataType,
  RelationOnDeleteAction,
} from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { WorkspaceJoinColumn } from 'src/engine/twenty-orm/decorators/workspace-join-column.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { MarketingCampaignWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/marketing-campaign.workspace-entity';
import { ProspectLeadWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/prospect-lead.workspace-entity';

export const OUTREACH_MESSAGE_STANDARD_FIELD_IDS = {
  subject: '20000000-3000-0000-0000-000000000001',
  content: '20000000-3000-0000-0000-000000000002',
  platform: '20000000-3000-0000-0000-000000000003',
  status: '20000000-3000-0000-0000-000000000004',
  sentAt: '20000000-3000-0000-0000-000000000005',
  deliveredAt: '20000000-3000-0000-0000-000000000006',
  readAt: '20000000-3000-0000-0000-000000000007',
  repliedAt: '20000000-3000-0000-0000-000000000008',
  aiGenerated: '20000000-3000-0000-0000-000000000009',
  personalizationData: '20000000-3000-0000-0000-00000000000a',
  errorMessage: '20000000-3000-0000-0000-00000000000b',
  campaign: '20000000-3000-0000-0000-00000000000c',
  lead: '20000000-3000-0000-0000-00000000000d',
};

export type MessageStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'replied'
  | 'failed'
  | 'bounced';

export type OutreachPlatform =
  | 'email'
  | 'twitter'
  | 'linkedin'
  | 'instagram'
  | 'facebook'
  | 'other';

@WorkspaceEntity({
  standardId: '20000000-3000-0000-0000-000000000000',
  namePlural: 'outreachMessages',
  labelSingular: msg`Outreach Message`,
  labelPlural: msg`Outreach Messages`,
  description: msg`AI-generated outreach messages for marketing campaigns`,
  icon: 'IconMail',
  labelIdentifierStandardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.subject,
})
export class OutreachMessageWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.subject,
    type: FieldMetadataType.TEXT,
    label: msg`Subject`,
    description: msg`Message subject or headline`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  subject: string | null;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.content,
    type: FieldMetadataType.TEXT,
    label: msg`Content`,
    description: msg`Message content`,
    icon: 'IconMessage',
  })
  content: string;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.platform,
    type: FieldMetadataType.SELECT,
    label: msg`Platform`,
    description: msg`Platform for outreach`,
    icon: 'IconWorld',
    options: [
      { value: 'email', label: 'Email', position: 0, color: 'blue' },
      { value: 'twitter', label: 'Twitter', position: 1, color: 'sky' },
      { value: 'linkedin', label: 'LinkedIn', position: 2, color: 'blue' },
      {
        value: 'instagram',
        label: 'Instagram',
        position: 3,
        color: 'purple',
      },
      { value: 'facebook', label: 'Facebook', position: 4, color: 'blue' },
      { value: 'other', label: 'Other', position: 5, color: 'gray' },
    ],
    defaultValue: "'email'",
  })
  platform: OutreachPlatform;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Message status`,
    icon: 'IconProgress',
    options: [
      { value: 'draft', label: 'Draft', position: 0, color: 'gray' },
      {
        value: 'scheduled',
        label: 'Scheduled',
        position: 1,
        color: 'yellow',
      },
      { value: 'sending', label: 'Sending', position: 2, color: 'blue' },
      { value: 'sent', label: 'Sent', position: 3, color: 'purple' },
      {
        value: 'delivered',
        label: 'Delivered',
        position: 4,
        color: 'turquoise',
      },
      { value: 'read', label: 'Read', position: 5, color: 'sky' },
      { value: 'replied', label: 'Replied', position: 6, color: 'green' },
      { value: 'failed', label: 'Failed', position: 7, color: 'red' },
      { value: 'bounced', label: 'Bounced', position: 8, color: 'orange' },
    ],
    defaultValue: "'draft'",
  })
  status: MessageStatus;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.sentAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Sent At`,
    description: msg`When the message was sent`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  sentAt: Date | null;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.deliveredAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Delivered At`,
    description: msg`When the message was delivered`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  deliveredAt: Date | null;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.readAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Read At`,
    description: msg`When the message was read`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  readAt: Date | null;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.repliedAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Replied At`,
    description: msg`When the recipient replied`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  repliedAt: Date | null;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.aiGenerated,
    type: FieldMetadataType.BOOLEAN,
    label: msg`AI Generated`,
    description: msg`Whether the message was generated by AI`,
    icon: 'IconRobot',
    defaultValue: false,
  })
  aiGenerated: boolean;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.personalizationData,
    type: FieldMetadataType.RAW_JSON,
    label: msg`Personalization Data`,
    description: msg`Data used for message personalization`,
    icon: 'IconUser',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  personalizationData: Record<string, any> | null;

  @WorkspaceField({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.errorMessage,
    type: FieldMetadataType.TEXT,
    label: msg`Error Message`,
    description: msg`Error message if sending failed`,
    icon: 'IconAlertTriangle',
  })
  @WorkspaceIsNullable()
  errorMessage: string | null;

  // Relations
  @WorkspaceRelation({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.campaign,
    type: RelationType.MANY_TO_ONE,
    label: msg`Campaign`,
    description: msg`Marketing campaign this message belongs to`,
    icon: 'IconSpeakerphone',
    inverseSideTarget: () => MarketingCampaignWorkspaceEntity,
    inverseSideFieldKey: 'outreachMessages',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  campaign: Relation<MarketingCampaignWorkspaceEntity> | null;

  @WorkspaceJoinColumn('campaign')
  campaignId: string | null;

  @WorkspaceRelation({
    standardId: OUTREACH_MESSAGE_STANDARD_FIELD_IDS.lead,
    type: RelationType.MANY_TO_ONE,
    label: msg`Lead`,
    description: msg`Prospect lead this message was sent to`,
    icon: 'IconUserPlus',
    inverseSideTarget: () => ProspectLeadWorkspaceEntity,
    inverseSideFieldKey: 'outreachMessages',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  lead: Relation<ProspectLeadWorkspaceEntity> | null;

  @WorkspaceJoinColumn('lead')
  leadId: string | null;
}
