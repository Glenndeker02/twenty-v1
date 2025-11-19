// Core CRM types matching the web app

export type Company = {
  id: string;
  name: string;
  domainName: string | null;
  address: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  } | null;
  employees: number | null;
  linkedinLink: {
    url: string;
    label: string;
  } | null;
  xLink: {
    url: string;
    label: string;
  } | null;
  annualRecurringRevenue: {
    amountMicros: number;
    currencyCode: string;
  } | null;
  idealCustomerProfile: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
  __typename: 'Company';
};

export type Person = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  email: string | null;
  phone: string | null;
  city: string | null;
  avatarUrl: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  companyId: string | null;
  company?: Company | null;
  __typename: 'Person';
};

export type Opportunity = {
  id: string;
  name: string;
  amount: {
    amountMicros: number;
    currencyCode: string;
  } | null;
  closeDate: string | null;
  probability: string;
  stage: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  pointOfContactId: string | null;
  pointOfContact?: Person | null;
  companyId: string | null;
  company?: Company | null;
  __typename: 'Opportunity';
};

export type TestimonialStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export type Testimonial = {
  id: string;
  customerName: string;
  customerRole: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
  submittedAt: string;
  status: TestimonialStatus | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  approvedById: string | null;
  __typename: 'Testimonial';
};

export type RecordConnection<T> = {
  edges: Array<{
    node: T;
    cursor: string;
  }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
  };
  totalCount: number;
};

export type RecordGqlOperationFilter = {
  [key: string]: any;
};

export type RecordGqlOperationOrderBy = {
  [key: string]: 'AscNullsFirst' | 'AscNullsLast' | 'DescNullsFirst' | 'DescNullsLast';
};
