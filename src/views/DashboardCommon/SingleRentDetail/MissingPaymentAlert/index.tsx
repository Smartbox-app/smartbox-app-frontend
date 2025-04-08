import { MyRentDetails, RentStatus } from 'smartbox-types';
import MissingPayment from './MissingPayment';

// import './MissingPaymentAlert.scss';
import { Alert } from 'src/components/Common';
import { Section } from 'src/components/ui';

interface Props {
  rent: MyRentDetails;
}

export const MissingPaymentAlert = ({ rent }: Props) => {
  if (
    ![
      RentStatus.noPaidExtension,
      RentStatus.noPaidExtensionWithWarning,
    ].includes(rent.status)
  )
    return null;

  return (
    <Section>
      {rent.status === RentStatus.noPaidExtension ? (
        <MissingPayment rent={rent} />
      ) : null}
      {rent.status === RentStatus.noPaidExtensionWithWarning ? (
        <Alert type="error" text="application.boxWasBlockedDueNoPayment" />
      ) : null}
    </Section>
  );
};
