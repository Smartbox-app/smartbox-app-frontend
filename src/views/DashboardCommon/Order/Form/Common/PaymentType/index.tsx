import {
  MyRentDetails,
  RentPaymentType,
  RentStatus,
  StockOrderRes,
  StockPaymentType,
} from 'smartbox-types';
import { AsterixRequired } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { InstallmentsPaymentMinDaysInfo } from 'src/views/DashboardCommon/Order/Form/Common/InstallmentsPaymentMinDaysInfo/InstallmentsPaymentMinDaysInfo';

import { SinglePaymentType } from './SinglePaymentType';

type Props = {
  stock: StockOrderRes;
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
