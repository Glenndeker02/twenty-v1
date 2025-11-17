import { msg } from '@lingui/core/macro';
import { FieldMetadataType } from 'twenty-shared/types';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';

export const TRENDING_TOPIC_STANDARD_FIELD_IDS = {
  topic: '20000000-1000-0000-0000-000000000001',
  description: '20000000-1000-0000-0000-000000000002',
  source: '20000000-1000-0000-0000-000000000003',
  sourceUrl: '20000000-1000-0000-0000-000000000004',
  relevanceScore: '20000000-1000-0000-0000-000000000005',
  category: '20000000-1000-0000-0000-000000000006',
  keywords: '20000000-1000-0000-0000-000000000007',
  aiInsights: '20000000-1000-0000-0000-000000000008',
  discoveredAt: '20000000-1000-0000-0000-000000000009',
};

@WorkspaceEntity({
  standardId: '20000000-1000-0000-0000-000000000000',
  namePlural: 'trendingTopics',
  labelSingular: msg`Trending Topic`,
  labelPlural: msg`Trending Topics`,
  description: msg`AI-discovered trending topics for content creation`,
  icon: 'IconTrendingUp',
  labelIdentifierStandardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.topic,
})
export class TrendingTopicWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.topic,
    type: FieldMetadataType.TEXT,
    label: msg`Topic`,
    description: msg`The trending topic`,
    icon: 'IconFlame',
  })
  topic: string;

  @WorkspaceField({
    standardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.description,
    type: FieldMetadataType.TEXT,
    label: msg`Description`,
    description: msg`Description of the trending topic`,
    icon: 'IconFileText',
  })
  @WorkspaceIsNullable()
  description: string | null;

  @WorkspaceField({
    standardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.source,
    type: FieldMetadataType.TEXT,
    label: msg`Source`,
    description: msg`Source of the trending topic (e.g., Twitter, Reddit, Google Trends)`,
    icon: 'IconWorld',
  })
  @WorkspaceIsNullable()
  source: string | null;

  @WorkspaceField({
    standardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.sourceUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Source URL`,
    description: msg`URL to the source`,
    icon: 'IconLink',
  })
  @WorkspaceIsNullable()
  sourceUrl: string | null;

  @WorkspaceField({
    standardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.relevanceScore,
    type: FieldMetadataType.NUMBER,
    label: msg`Relevance Score`,
    description: msg`AI-calculated relevance score (0-100)`,
    icon: 'IconChartBar',
  })
  @WorkspaceIsNullable()
  relevanceScore: number | null;

  @WorkspaceField({
    standardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.category,
    type: FieldMetadataType.TEXT,
    label: msg`Category`,
    description: msg`Topic category`,
    icon: 'IconTag',
  })
  @WorkspaceIsNullable()
  category: string | null;

  @WorkspaceField({
    standardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.keywords,
    type: FieldMetadataType.RAW_JSON,
    label: msg`Keywords`,
    description: msg`Related keywords and hashtags`,
    icon: 'IconHash',
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  keywords: string[] | null;

  @WorkspaceField({
    standardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.aiInsights,
    type: FieldMetadataType.TEXT,
    label: msg`AI Insights`,
    description: msg`AI-generated insights about the topic`,
    icon: 'IconRobot',
  })
  @WorkspaceIsNullable()
  aiInsights: string | null;

  @WorkspaceField({
    standardId: TRENDING_TOPIC_STANDARD_FIELD_IDS.discoveredAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Discovered At`,
    description: msg`When the topic was discovered`,
    icon: 'IconClock',
  })
  @WorkspaceIsNullable()
  discoveredAt: Date | null;
}
