import { MyRentDetails } from 'smartbox-types';

// import './MissingPaymentAlert.scss';
import { Alert } from 'src/components/Common';
import { Section } from 'src/components/ui';

interface Props {
  rent: MyRentDetails;
}

export const PendingPaymentAlert = ({ rent }: Props) => {
  if (!rent.pendingPayments) return null;

  return (
    <Section>
      <Alert type="notice" text="application.pendingPaymentOnRent" />
    </Section>
  );
};
