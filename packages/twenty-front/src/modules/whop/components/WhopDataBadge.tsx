import styled from '@emotion/styled';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1.5)};
  background-color: ${({ theme }) => theme.color.blue10};
  color: ${({ theme }) => theme.color.blue};
  border-radius: ${({ theme }) => theme.border.radius.sm};
  font-size: ${({ theme }) => theme.font.size.xs};
  font-weight: ${({ theme }) => theme.font.weight.medium};
`;

export const WhopDataBadge = () => {
  return <Badge>Whop</Badge>;
};
