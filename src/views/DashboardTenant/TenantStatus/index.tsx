import {
  InvoiceStatus,
  PaymentServiceStatus,
  SmsStatus,
} from '../../../components/Common';
import { useGetMyDetailsQuery } from 'src/queries';
import { __ } from 'src/helpers/i18n';
import styled from 'styled-components';

const StyledTenantStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TenantStatus = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user || !user.tenantId) return null;

  return (
    <StyledTenantStatus>
      <PaymentServiceStatus tenantId={user.tenantId} />
      <InvoiceStatus tenantId={user.tenantId} />
      <SmsStatus tenantId={user.tenantId!} />
    </StyledTenantStatus>
  );
};
