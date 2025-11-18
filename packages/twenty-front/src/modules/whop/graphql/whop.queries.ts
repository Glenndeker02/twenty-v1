import { gql } from '@apollo/client';

export const GET_WHOP_CONNECTION_STATUS = gql`
  query GetWhopConnectionStatus {
    whopConnectionStatus {
      isConnected
      lastSyncAt
      handle
    }
  }
`;

export const TRIGGER_WHOP_SYNC = gql`
  mutation TriggerWhopSync {
    triggerWhopSync {
      success
      productsSync
      usersSync
      membershipsSync
      errors
    }
  }
`;

export const DISCONNECT_WHOP_ACCOUNT = gql`
  mutation DisconnectWhopAccount {
    disconnectWhopAccount
  }
`;
