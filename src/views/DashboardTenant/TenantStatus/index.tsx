import { InvoiceStatus, SmsStatus } from '../../../components/Common';
import { useGetMyDetailsQuery } from 'src/queries';
import { Section } from 'src/components/ui';
import styled from 'styled-components';

const StyledSection = styled(Section)(({theme}) => ({
  padding: `${theme.spacing * 2}px ${theme.spacing * 4}px`,
  gap: theme.spacing,
  flexWrap: 'wrap'
}))

export const TenantStatus = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user || !user.tenantId) return null;

  return (
    <StyledSection direction="horizontal">
      <InvoiceStatus tenantId={user.tenantId} />
      <SmsStatus tenantId={user.tenantId!} />
    </StyledSection>
  );
};
