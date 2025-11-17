import { msg } from '@lingui/core/macro';
import {
  FieldMetadataType,
  RelationOnDeleteAction,
  ActorMetadata,
} from 'twenty-shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';
import { Relation } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { WorkspaceEntity } from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceIsFieldUIReadOnly } from 'src/engine/twenty-orm/decorators/workspace-is-field-ui-readonly.decorator';
import { WorkspaceIsNullable } from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
import { WorkspaceIsSystem } from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { TESTIMONIAL_STANDARD_FIELD_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
import { STANDARD_OBJECT_ICONS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
import { STANDARD_OBJECT_IDS } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
import { TestimonialTargetWorkspaceEntity } from 'src/modules/testimonial/standard-objects/testimonial-target.workspace-entity';
import { TimelineActivityWorkspaceEntity } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';
import { FavoriteWorkspaceEntity } from 'src/modules/favorite/standard-objects/favorite.workspace-entity';
import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace-member/standard-objects/workspace-member.workspace-entity';

@WorkspaceEntity({
  standardId: STANDARD_OBJECT_IDS.testimonial,
  namePlural: 'testimonials',
  labelSingular: msg`Testimonial`,
  labelPlural: msg`Testimonials`,
  description: msg`A customer testimonial`,
  icon: STANDARD_OBJECT_ICONS.testimonial,
  labelIdentifierStandardId: TESTIMONIAL_STANDARD_FIELD_IDS.customerName,
})
export class TestimonialWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.position,
    type: FieldMetadataType.POSITION,
    label: msg`Position`,
    description: msg`Testimonial record position`,
    icon: 'IconHierarchy2',
    defaultValue: 0,
  })
  @WorkspaceIsSystem()
  position: number;

  @WorkspaceField({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.customerName,
    type: FieldMetadataType.TEXT,
    label: msg`Customer Name`,
    description: msg`Name of the customer providing the testimonial`,
    icon: 'IconUser',
  })
  customerName: string;

  @WorkspaceField({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.customerRole,
    type: FieldMetadataType.TEXT,
    label: msg`Customer Role`,
    description: msg`Role/title of the customer (e.g., CEO at Company)`,
    icon: 'IconBriefcase',
  })
  @WorkspaceIsNullable()
  customerRole: string | null;

  @WorkspaceField({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.content,
    type: FieldMetadataType.TEXT,
    label: msg`Content`,
    description: msg`Testimonial message content`,
    icon: 'IconFileText',
  })
  content: string;

  @WorkspaceField({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.rating,
    type: FieldMetadataType.NUMBER,
    label: msg`Rating`,
    description: msg`Rating from 1 to 5 stars`,
    icon: 'IconStar',
    defaultValue: 5,
  })
  rating: number;

  @WorkspaceField({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.avatarUrl,
    type: FieldMetadataType.TEXT,
    label: msg`Avatar URL`,
    description: msg`URL to customer avatar/photo`,
    icon: 'IconPhoto',
  })
  @WorkspaceIsNullable()
  avatarUrl: string | null;

  @WorkspaceField({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.submittedAt,
    type: FieldMetadataType.DATE_TIME,
    label: msg`Submitted At`,
    description: msg`Date when testimonial was submitted`,
    icon: 'IconCalendar',
  })
  submittedAt: Date;

  @WorkspaceField({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.status,
    type: FieldMetadataType.SELECT,
    label: msg`Status`,
    description: msg`Testimonial approval status`,
    icon: 'IconProgressCheck',
    defaultValue: "'PENDING'",
    options: [
      { value: 'DRAFT', label: 'Draft', position: 0, color: 'gray' },
      { value: 'PENDING', label: 'Pending', position: 1, color: 'yellow' },
      { value: 'APPROVED', label: 'Approved', position: 2, color: 'green' },
      { value: 'REJECTED', label: 'Rejected', position: 3, color: 'red' },
    ],
  })
  @WorkspaceIsNullable()
  status: string | null;

  @WorkspaceField({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.createdBy,
    type: FieldMetadataType.ACTOR,
    label: msg`Created by`,
    icon: 'IconCreativeCommonsSa',
    description: msg`The creator of the record`,
  })
  @WorkspaceIsFieldUIReadOnly()
  createdBy: ActorMetadata;

  @WorkspaceRelation({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.approvedBy,
    label: msg`Approved By`,
    description: msg`Workspace member who approved this testimonial`,
    icon: 'IconUserCheck',
    type: RelationType.MANY_TO_ONE,
    inverseSideTarget: () => WorkspaceMemberWorkspaceEntity,
    inverseSideFieldKey: 'approvedTestimonials',
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  approvedBy: Relation<WorkspaceMemberWorkspaceEntity> | null;

  @WorkspaceRelation({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.testimonialTargets,
    label: msg`Relations`,
    description: msg`Testimonial targets`,
    icon: 'IconArrowUpRight',
    type: RelationType.ONE_TO_MANY,
    inverseSideTarget: () => TestimonialTargetWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  testimonialTargets: Relation<TestimonialTargetWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.timelineActivities,
    type: RelationType.ONE_TO_MANY,
    label: msg`Timeline Activities`,
    description: msg`Timeline Activities linked to the testimonial.`,
    icon: 'IconTimelineEvent',
    inverseSideTarget: () => TimelineActivityWorkspaceEntity,
    onDelete: RelationOnDeleteAction.SET_NULL,
  })
  @WorkspaceIsNullable()
  @WorkspaceIsSystem()
  timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

  @WorkspaceRelation({
    standardId: TESTIMONIAL_STANDARD_FIELD_IDS.favorites,
    type: RelationType.ONE_TO_MANY,
    label: msg`Favorites`,
    description: msg`Favorites linked to the testimonial`,
    icon: 'IconHeart',
    inverseSideTarget: () => FavoriteWorkspaceEntity,
    onDelete: RelationOnDeleteAction.CASCADE,
  })
  @WorkspaceIsSystem()
  favorites: Relation<FavoriteWorkspaceEntity[]>;
}
