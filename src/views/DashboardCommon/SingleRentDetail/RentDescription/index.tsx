import { MyRentDetails, RentDescription, RentUserData } from 'smartbox-types';
import { __ } from '../../../../helpers/i18n';
import { RentHistory } from '../../RentHistory';
import { Header, Section, Typography } from 'src/components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

interface Props {
  description: RentDescription[];
  rent: MyRentDetails;
}

export const Description = ({ description, rent }: Props) => {
  const { getText } = useTenantNaming();

  if(description.length === 0) return null;

  const firstRent = description[0];
  const clientSource = firstRent.data?.clientSource;
  return (
    <Section>
      <Header variant="h2">{__('application.rentHistory')}</Header>
      {clientSource ? (
        <div>
          <strong>{__(getText('client_source'))}</strong>
          <Typography>{clientSource}</Typography>{' '}
        </div>
      ) : (
        ''
      )}
      <RentHistory
        description={description}
        rentId={rent.id}
        paymentType={rent.paymentType}
        periods={rent.periods}
      />
    </Section>
  );
};
