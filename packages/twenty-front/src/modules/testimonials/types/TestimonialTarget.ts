import { Company } from '@/companies/types/Company';
import { Opportunity } from '@/opportunities/types/Opportunity';
import { Person } from '@/people/types/Person';
import { Testimonial } from '@/testimonials/types/Testimonial';

export type TestimonialTarget = {
  id: string;
  createdAt: string;
  updatedAt: string;
  testimonialId?: string | null;
  companyId?: string | null;
  personId?: string | null;
  opportunityId?: string | null;
  testimonial?: Pick<Testimonial, 'id' | 'createdAt' | 'updatedAt' | '__typename'>;
  person?: Pick<Person, 'id' | 'name' | 'avatarUrl' | '__typename'> | null;
  company?: Pick<Company, 'id' | 'name' | 'domainName' | '__typename'> | null;
  opportunity?: Pick<Opportunity, 'id' | 'name' | '__typename'> | null;
  [key: string]: any; // Supports custom object properties
  __typename: 'TestimonialTarget';
};
