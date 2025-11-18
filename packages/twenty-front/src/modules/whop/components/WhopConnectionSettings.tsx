import { useEffect } from 'react';
import styled from '@emotion/styled';

import { useWhopConnection } from 'src/modules/whop/hooks/useWhopConnection';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(6)};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  margin: 0;
`;

const StatusBadge = styled.div<{ connected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme, connected }) =>
    connected ? theme.color.green : theme.color.gray20};
  color: ${({ theme, connected }) =>
    connected ? theme.color.white : theme.color.gray60};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.sm};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.font.color.primary};
`;

const Value = styled.div`
  font-size: ${({ theme }) => theme.font.size.md};
  color: ${({ theme }) => theme.font.color.secondary};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.md};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  cursor: pointer;
  border: none;
  background-color: ${({ theme, variant }) => {
    if (variant === 'danger') return theme.color.red;
    if (variant === 'secondary') return theme.color.gray20;
    return theme.color.blue;
  }};
  color: ${({ theme, variant }) =>
    variant === 'secondary' ? theme.font.color.primary : theme.color.white};

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

const SyncResult = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => theme.background.secondary};
  border-radius: ${({ theme }) => theme.border.radius.md};
  border-left: 4px solid ${({ theme }) => theme.color.blue};
`;

const SyncStat = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(1)} 0;
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => theme.color.red10};
  color: ${({ theme }) => theme.color.red};
  border-radius: ${({ theme }) => theme.border.radius.md};
  border-left: 4px solid ${({ theme }) => theme.color.red};
`;

export const WhopConnectionSettings = () => {
  const {
    connectionState,
    syncResult,
    triggerSync,
    disconnect,
    connectWhop,
    refetchStatus,
  } = useWhopConnection();

  useEffect(() => {
    refetchStatus();
  }, [refetchStatus]);

  return (
    <Container>
      <Header>
        <Title>Whop Integration</Title>
        <StatusBadge connected={connectionState.isConnected}>
          {connectionState.isConnected ? '● Connected' : '○ Disconnected'}
        </StatusBadge>
      </Header>

      {!connectionState.isConnected ? (
        <Section>
          <Label>Connect your Whop account</Label>
          <Value>
            Sync your Whop customers, memberships, and products with your CRM.
          </Value>
          <ButtonGroup>
            <Button variant="primary" onClick={connectWhop}>
              Connect Whop Account
            </Button>
          </ButtonGroup>
        </Section>
      ) : (
        <>
          <Section>
            <Label>Account</Label>
            <Value>{connectionState.handle || 'Connected'}</Value>
          </Section>

          {connectionState.lastSyncAt && (
            <Section>
              <Label>Last Sync</Label>
              <Value>
                {new Date(connectionState.lastSyncAt).toLocaleString()}
              </Value>
            </Section>
          )}

          {syncResult && (
            <Section>
              <Label>Last Sync Results</Label>
              <SyncResult>
                {syncResult.success ? (
                  <>
                    <SyncStat>
                      <span>Products synced:</span>
                      <strong>{syncResult.productsSync}</strong>
                    </SyncStat>
                    <SyncStat>
                      <span>Users synced:</span>
                      <strong>{syncResult.usersSync}</strong>
                    </SyncStat>
                    <SyncStat>
                      <span>Memberships synced:</span>
                      <strong>{syncResult.membershipsSync}</strong>
                    </SyncStat>
                  </>
                ) : (
                  <ErrorMessage>
                    Sync failed: {syncResult.errors.join(', ')}
                  </ErrorMessage>
                )}
              </SyncResult>
            </Section>
          )}

          {connectionState.error && (
            <ErrorMessage>{connectionState.error}</ErrorMessage>
          )}

          <ButtonGroup>
            <Button
              variant="primary"
              onClick={triggerSync}
              disabled={connectionState.isSyncing}
            >
              {connectionState.isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
            <Button variant="danger" onClick={disconnect}>
              Disconnect
            </Button>
          </ButtonGroup>
        </>
      )}
    </Container>
  );
};
