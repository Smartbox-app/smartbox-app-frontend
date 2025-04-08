import { MyRentDetails, RentDescription } from 'smartbox-types';
import { __ } from '../../../../helpers/i18n';
import { RentHistory } from '../../RentHistory';
import { Header, Section } from 'src/components/ui';

interface Props {
  description: RentDescription[];
  rent: MyRentDetails;
}

export const Description = ({ description, rent }: Props) => {
  return (
    <Section>
      <Header variant="h2">{__('application.rentHistory')}</Header>
      <RentHistory
        description={description}
        rentId={rent.id}
        paymentType={rent.paymentType}
        periods={rent.periods}
      />
    </Section>
  );
};
