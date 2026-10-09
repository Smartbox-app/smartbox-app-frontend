import { __ } from '../../../../../../helpers/i18n';
import {
  MyRentDetails,
  RentPaymentType,
  RentStatus,
  StockPaymentType,
  StockRes,
} from 'smartbox-types';
import { SinglePaymentType } from './SinglePaymentType';
import { Header, Section } from 'src/components/ui';
import { InstallmentsPaymentMinDaysInfo } from '../InstallmentsPaymentMinDaysInfo';
import { AsterixRequired } from 'src/components/Common';

type Props = {
  stock: StockRes;
  rent?: MyRentDetails;
};

export const PaymentType = ({ stock, rent }: Props) => {
  const paymentConfig = stock.clientPaymentTypeConfig;

  const getPaymentTypeText = (type: StockPaymentType, rent?: MyRentDetails) => {
    if (rent && rent.status !== RentStatus.rented)
      return 'application.paymentInAdvance';
    switch (type) {
      case StockPaymentType.Both:
        return 'application.choosePaymentType';
      case StockPaymentType.InAdvance:
        return 'application.paymentInAdvance';
      case StockPaymentType.Installments:
        return 'application.paymentInstallments';
    }
  };

  return (
    <Section>
      <Header variant="h2">{__('application.paymentType')} <AsterixRequired /></Header>
      <p>{__(getPaymentTypeText(paymentConfig, rent))}</p>

      {(!rent || (rent && rent.status === RentStatus.rented ))&& [StockPaymentType.Both, StockPaymentType.Installments].includes(
        paymentConfig,
      ) ? (
        <InstallmentsPaymentMinDaysInfo />
      ) : null}

      {(!rent || (rent && rent.status === RentStatus.rented)) &&
      paymentConfig === StockPaymentType.Both ? (
        <ul>
          <SinglePaymentType
            type={RentPaymentType.InAdvance}
            label="application.paymentInAdvance"
          />
          <SinglePaymentType
            type={RentPaymentType.Installments}
            label="application.paymentInstallments"
          />
        </ul>
      ) : null}
    </Section>
  );
};
