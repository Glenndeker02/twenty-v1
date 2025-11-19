import { gql } from '@apollo/client';

// ==================== COMPANIES ====================

export const GET_COMPANIES = gql`
  query GetCompanies(
    $filter: CompanyFilterInput
    $orderBy: [CompanyOrderByInput!]
    $first: Int
    $after: String
  ) {
    companies(filter: $filter, orderBy: $orderBy, first: $first, after: $after) {
      edges {
        node {
          id
          name
          domainName
          address
          employees
          linkedinLink
          xLink
          annualRecurringRevenue
          idealCustomerProfile
          position
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_COMPANY = gql`
  query GetCompany($id: ID!) {
    company(id: $id) {
      id
      name
      domainName
      address
      employees
      linkedinLink
      xLink
      annualRecurringRevenue
      idealCustomerProfile
      position
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($data: CompanyCreateInput!) {
    createCompany(data: $data) {
      id
      name
      domainName
      createdAt
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: ID!, $data: CompanyUpdateInput!) {
    updateCompany(id: $id, data: $data) {
      id
      name
      domainName
      updatedAt
    }
  }
`;

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
      id
    }
  }
`;

// ==================== PEOPLE ====================

export const GET_PEOPLE = gql`
  query GetPeople(
    $filter: PersonFilterInput
    $orderBy: [PersonOrderByInput!]
    $first: Int
    $after: String
  ) {
    people(filter: $filter, orderBy: $orderBy, first: $first, after: $after) {
      edges {
        node {
          id
          name {
            firstName
            lastName
          }
          email
          phone
          city
          avatarUrl
          position
          createdAt
          updatedAt
          companyId
          company {
            id
            name
            domainName
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_PERSON = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      id
      name {
        firstName
        lastName
      }
      email
      phone
      city
      avatarUrl
      position
      createdAt
      updatedAt
      companyId
      company {
        id
        name
        domainName
      }
    }
  }
`;

export const CREATE_PERSON = gql`
  mutation CreatePerson($data: PersonCreateInput!) {
    createPerson(data: $data) {
      id
      name {
        firstName
        lastName
      }
      email
      createdAt
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $data: PersonUpdateInput!) {
    updatePerson(id: $id, data: $data) {
      id
      name {
        firstName
        lastName
      }
      email
      updatedAt
    }
  }
`;

export const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

// ==================== OPPORTUNITIES ====================

export const GET_OPPORTUNITIES = gql`
  query GetOpportunities(
    $filter: OpportunityFilterInput
    $orderBy: [OpportunityOrderByInput!]
    $first: Int
    $after: String
  ) {
    opportunities(filter: $filter, orderBy: $orderBy, first: $first, after: $after) {
      edges {
        node {
          id
          name
          amount {
            amountMicros
            currencyCode
          }
          closeDate
          probability
          stage
          position
          createdAt
          updatedAt
          pointOfContactId
          pointOfContact {
            id
            name {
              firstName
              lastName
            }
          }
          companyId
          company {
            id
            name
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_OPPORTUNITY = gql`
  query GetOpportunity($id: ID!) {
    opportunity(id: $id) {
      id
      name
      amount {
        amountMicros
        currencyCode
      }
      closeDate
      probability
      stage
      position
      createdAt
      updatedAt
      pointOfContactId
      pointOfContact {
        id
        name {
          firstName
          lastName
        }
        email
      }
      companyId
      company {
        id
        name
        domainName
      }
    }
  }
`;

export const CREATE_OPPORTUNITY = gql`
  mutation CreateOpportunity($data: OpportunityCreateInput!) {
    createOpportunity(data: $data) {
      id
      name
      amount {
        amountMicros
        currencyCode
      }
      createdAt
    }
  }
`;

export const UPDATE_OPPORTUNITY = gql`
  mutation UpdateOpportunity($id: ID!, $data: OpportunityUpdateInput!) {
    updateOpportunity(id: $id, data: $data) {
      id
      name
      amount {
        amountMicros
        currencyCode
      }
      updatedAt
    }
  }
`;

export const DELETE_OPPORTUNITY = gql`
  mutation DeleteOpportunity($id: ID!) {
    deleteOpportunity(id: $id) {
      id
    }
  }
`;

// ==================== TESTIMONIALS ====================

export const GET_TESTIMONIALS = gql`
  query GetTestimonials(
    $filter: TestimonialFilterInput
    $orderBy: [TestimonialOrderByInput!]
    $first: Int
    $after: String
  ) {
    testimonials(filter: $filter, orderBy: $orderBy, first: $first, after: $after) {
      edges {
        node {
          id
          customerName
          customerRole
          content
          rating
          avatarUrl
          submittedAt
          status
          position
          createdAt
          updatedAt
          approvedById
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const GET_TESTIMONIAL = gql`
  query GetTestimonial($id: ID!) {
    testimonial(id: $id) {
      id
      customerName
      customerRole
      content
      rating
      avatarUrl
      submittedAt
      status
      position
      createdAt
      updatedAt
      approvedById
    }
  }
`;

export const CREATE_TESTIMONIAL = gql`
  mutation CreateTestimonial($data: TestimonialCreateInput!) {
    createTestimonial(data: $data) {
      id
      customerName
      content
      rating
      status
      createdAt
    }
  }
`;

export const UPDATE_TESTIMONIAL = gql`
  mutation UpdateTestimonial($id: ID!, $data: TestimonialUpdateInput!) {
    updateTestimonial(id: $id, data: $data) {
      id
      customerName
      content
      rating
      status
      updatedAt
    }
  }
`;

export const DELETE_TESTIMONIAL = gql`
  mutation DeleteTestimonial($id: ID!) {
    deleteTestimonial(id: $id) {
      id
    }
  }
`;

export const APPROVE_TESTIMONIAL = gql`
  mutation ApproveTestimonial($id: ID!) {
    updateTestimonial(id: $id, data: { status: APPROVED }) {
      id
      status
      updatedAt
    }
  }
`;

export const REJECT_TESTIMONIAL = gql`
  mutation RejectTestimonial($id: ID!) {
    updateTestimonial(id: $id, data: { status: REJECTED }) {
      id
      status
      updatedAt
    }
  }
`;
