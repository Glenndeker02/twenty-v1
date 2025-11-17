import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { useMutation, useQuery } from '@apollo/client';

import {
  GET_WHOP_CONNECTION_STATUS,
  TRIGGER_WHOP_SYNC,
  DISCONNECT_WHOP_ACCOUNT,
} from 'src/modules/whop/graphql/whop.queries';
import {
  whopConnectionState,
  whopSyncResultState,
} from 'src/modules/whop/states/whopConnectionState';

export const useWhopConnection = () => {
  const [connectionState, setConnectionState] = useRecoilState(whopConnectionState);
  const [syncResult, setSyncResult] = useRecoilState(whopSyncResultState);

  const { refetch: refetchStatus } = useQuery(GET_WHOP_CONNECTION_STATUS, {
    onCompleted: (data) => {
      setConnectionState({
        ...connectionState,
        isConnected: data.whopConnectionStatus.isConnected,
        lastSyncAt: data.whopConnectionStatus.lastSyncAt
          ? new Date(data.whopConnectionStatus.lastSyncAt)
          : undefined,
        handle: data.whopConnectionStatus.handle,
      });
    },
    onError: (error) => {
      setConnectionState({
        ...connectionState,
        error: error.message,
      });
    },
  });

  const [triggerSyncMutation] = useMutation(TRIGGER_WHOP_SYNC, {
    onCompleted: (data) => {
      setSyncResult(data.triggerWhopSync);
      setConnectionState({
        ...connectionState,
        isSyncing: false,
      });
      refetchStatus();
    },
    onError: (error) => {
      setConnectionState({
        ...connectionState,
        isSyncing: false,
        error: error.message,
      });
    },
  });

  const [disconnectMutation] = useMutation(DISCONNECT_WHOP_ACCOUNT, {
    onCompleted: () => {
      setConnectionState({
        isConnected: false,
        isSyncing: false,
      });
      setSyncResult(null);
    },
    onError: (error) => {
      setConnectionState({
        ...connectionState,
        error: error.message,
      });
    },
  });

  const triggerSync = useCallback(() => {
    setConnectionState({
      ...connectionState,
      isSyncing: true,
    });
    triggerSyncMutation();
  }, [connectionState, setConnectionState, triggerSyncMutation]);

  const disconnect = useCallback(() => {
    disconnectMutation();
  }, [disconnectMutation]);

  const connectWhop = useCallback(() => {
    // Generate transient token and redirect to OAuth flow
    // This would need to integrate with the existing auth flow
    const redirectUrl = '/settings/integrations/whop';
    window.location.href = `/auth/whop?redirectLocation=${encodeURIComponent(redirectUrl)}`;
  }, []);

  return {
    connectionState,
    syncResult,
    triggerSync,
    disconnect,
    connectWhop,
    refetchStatus,
  };
};
