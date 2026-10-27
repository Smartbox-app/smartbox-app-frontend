import { MyRentDetails, RentStatus } from 'smartbox-types';
import { Alert } from 'src/components/Common';
import { Section } from 'src/components/ui';
import MissingPayment from 'src/views/DashboardCommon/SingleRentDetail/MissingPaymentAlert/MissingPayment';

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
