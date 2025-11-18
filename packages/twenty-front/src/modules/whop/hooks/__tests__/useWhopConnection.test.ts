import { renderHook } from '@testing-library/react';
import { RecoilRoot } from 'recoil';

import { useWhopConnection } from '../useWhopConnection';

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    loading: false,
    error: null,
    refetch: jest.fn(),
  })),
  useMutation: jest.fn(() => [jest.fn(), { data: null, loading: false, error: null }]),
  gql: jest.fn((query) => query),
}));

describe('useWhopConnection', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RecoilRoot>{children}</RecoilRoot>
  );

  it('should provide connection state', () => {
    const { result } = renderHook(() => useWhopConnection(), { wrapper });

    expect(result.current.connectionState).toBeDefined();
    expect(result.current.connectionState.isConnected).toBe(false);
    expect(result.current.connectionState.isSyncing).toBe(false);
  });

  it('should provide sync, disconnect, and connect functions', () => {
    const { result } = renderHook(() => useWhopConnection(), { wrapper });

    expect(typeof result.current.triggerSync).toBe('function');
    expect(typeof result.current.disconnect).toBe('function');
    expect(typeof result.current.connectWhop).toBe('function');
    expect(typeof result.current.refetchStatus).toBe('function');
  });
});
