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
import { PersonWorkspaceEntity } from 'src/modules/person/standard-objects/person.workspace-entity';
import { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';
import { MarketingCampaignWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/marketing-campaign.workspace-entity';
import { OutreachMessageWorkspaceEntity } from 'src/modules/marketing-ai-agent/standard-objects/outreach-message.workspace-entity';

export const PROSPECT_LEAD_STANDARD_FIELD_IDS = {
  name: '20000000-2000-0000-0000-000000000001',
  email: '20000000-2000-0000-0000-000000000002',
  source: '20000000-2000-0000-0000-000000000003',
  sourceUrl: '20000000-2000-0000-0000-000000000004',
  leadScore: '20000000-2000-0000-0000-000000000005',
  status: '20000000-2000-0000-0000-000000000006',
  aiProfile: '20000000-2000-0000-0000-000000000007',
  socialMediaHandles: '20000000-2000-0000-0000-000000000008',
  discoveredAt: '20000000-2000-0000-0000-000000000009',
  campaign: '20000000-2000-0000-0000-00000000000a',
  person: '20000000-2000-0000-0000-00000000000b',
  company: '20000000-2000-0000-0000-00000000000c',
};

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'engaged'
  | 'qualified'
  | 'converted'
  | 'rejected';

@WorkspaceEntity({
  standardId: '20000000-2000-0000-0000-000000000000',
  namePlural: 'prospectLeads',
  labelSingular: msg`Prospect Lead`,
  labelPlural: msg`Prospect Leads`,
  description: msg`AI-discovered potential customers`,
  icon: 'IconUserPlus',
  labelIdentifierStandardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.name,
})
export class ProspectLeadWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.name,
    type: FieldMetadataType.TEXT,
    label: msg`Name`,
    description: msg`Lead name`,
    icon: 'IconUser',
  })
  name: string;

  @WorkspaceField({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.email,
    type: FieldMetadataType.TEXT,
    label: msg`Email`,
    description: msg`Lead email address`,
    icon: 'IconMail',
  })
  @WorkspaceIsNullable()
  email: string | null;

  @WorkspaceField({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.source,
    type: FieldMetadataType.TEXT,
    label: msg`Source`,
    description: msg`Source of the lead discovery`,
    icon: 'IconWorld',
  })
  @WorkspaceIsNullable()
  source: string | null;

  @WorkspaceField({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.sourceUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Source URL`,
    description: msg`URL where the lead was discovered`,
    icon: 'IconLink',
  })
  @WorkspaceIsNullable()
  sourceUrl: string | null;

  @WorkspaceField({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.leadScore,
    type: FieldMetadataType.NUMBER,
    label: msg`Lead Score`,
    description: msg`AI-calculated lead quality score (0-100)`,
    icon: 'IconChartBar',
  })
  @WorkspaceIsNullable()
  leadScore: number | null;

  @WorkspaceField({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Lead status`,
    icon: 'IconProgress',
    options: [
      { value: 'new', label: 'New', position: 0, color: 'blue' },
      { value: 'contacted', label: 'Contacted', position: 1, color: 'purple' },
      { value: 'engaged', label: 'Engaged', position: 2, color: 'yellow' },
      { value: 'qualified', label: 'Qualified', position: 3, color: 'orange' },
      { value: 'converted', label: 'Converted', position: 4, color: 'green' },
      { value: 'rejected', label: 'Rejected', position: 5, color: 'red' },
    ],
    defaultValue: "'new'",
  })
  status: LeadStatus;

  @WorkspaceField({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.aiProfile,
    type: FieldMetadataType.TEXT,
    label: msg`AI Profile`,
    description: msg`AI-generated profile and insights about the lead`,
    icon: 'IconRobot',
  })
  @WorkspaceIsNullable()
  aiProfile: string | null;

  @WorkspaceField({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.socialMediaHandles,
    type: FieldMetadataType.RAW_JSON,
    label: msg`Social Media Handles`,
    description: msg`Social media profiles`,
    icon: 'IconBrandTwitter',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  socialMediaHandles: Record<string, string> | null;

  @WorkspaceField({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.discoveredAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Discovered At`,
    description: msg`When the lead was discovered`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  discoveredAt: Date | null;

  // Relations
  @WorkspaceRelation({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.campaign,
    type: RelationType.MANY_TO_ONE,
    label: msg`Campaign`,
    description: msg`Marketing campaign this lead belongs to`,
    icon: 'IconSpeakerphone',
    inverseSideTarget: () => MarketingCampaignWorkspaceEntity,
    inverseSideFieldKey: 'prospectLeads',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  campaign: Relation<MarketingCampaignWorkspaceEntity> | null;

  @WorkspaceJoinColumn('campaign')
  campaignId: string | null;

  @WorkspaceRelation({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.person,
    type: RelationType.MANY_TO_ONE,
    label: msg`Person`,
    description: msg`Linked person in CRM`,
    icon: 'IconUser',
    inverseSideTarget: () => PersonWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  person: Relation<PersonWorkspaceEntity> | null;

  @WorkspaceJoinColumn('person')
  personId: string | null;

  @WorkspaceRelation({
    standardId: PROSPECT_LEAD_STANDARD_FIELD_IDS.company,
    type: RelationType.MANY_TO_ONE,
    label: msg`Company`,
    description: msg`Linked company in CRM`,
    icon: 'IconBuildingSkyscraper',
    inverseSideTarget: () => CompanyWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  company: Relation<CompanyWorkspaceEntity> | null;

  @WorkspaceJoinColumn('company')
  companyId: string | null;

  @WorkspaceRelation({
    standardId: '20000000-2000-0000-0000-00000000000d',
    type: RelationType.ONE_TO_MANY,
    label: msg`Outreach Messages`,
    description: msg`Outreach messages sent to this lead`,
    icon: 'IconMail',
    inverseSideTarget: () => OutreachMessageWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  outreachMessages: Relation<OutreachMessageWorkspaceEntity[]>;
}
