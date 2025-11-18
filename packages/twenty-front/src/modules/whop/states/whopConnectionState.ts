import { atom } from 'recoil';

export type WhopConnectionState = {
  isConnected: boolean;
  lastSyncAt?: Date;
  handle?: string;
  isSyncing: boolean;
  error?: string;
};

export const whopConnectionState = atom<WhopConnectionState>({
  key: 'whopConnectionState',
  default: {
    isConnected: false,
    isSyncing: false,
  },
});

export const whopSyncResultState = atom<{
  success: boolean;
  productsSync: number;
  usersSync: number;
  membershipsSync: number;
  errors: string[];
} | null>({
  key: 'whopSyncResultState',
  default: null,
});
