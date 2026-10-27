import styled from 'styled-components';

import { MyRentDetails, RentAgreementType, RentDescription } from 'smartbox-types';
import { Header, Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { RentHistory } from '../../RentHistory';

interface Props {
  description: RentDescription[];
  rent: MyRentDetails;
}

const StyledClientSource = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Description = ({ description, rent }: Props) => {
  const { getText } = useTenantNaming();

  if (description.length === 0) return null;

  const firstRent = description[0];
  const clientSource = firstRent.data?.clientSource;
  return (
    <Section>
      <Header variant="h2">{__('application.rentHistory')}</Header>
      {clientSource ? (
        <StyledClientSource>
          <strong>{getText('client_source')}</strong>
          <Typography>{clientSource}</Typography>{' '}
        </StyledClientSource>
      ) : (
        ''
      )}
      <RentHistory
        description={description}
        rentId={rent.id}
        isOpenEnded={rent.agreementType === RentAgreementType.OpenEnded}
        paymentType={rent.paymentType}
        periods={rent.periods ?? []}
          />
        </Section>
  );
};
