import styled from 'styled-components';
import { __ } from '../../../../../../helpers/i18n';
import {
  IStock,
  MyRentDetails,
  RentPaymentType,
  RentStatus,
  StockPaymentType,
} from 'smartbox-types';
import { SinglePaymentType } from './SinglePaymentType';
import { Header, Section } from 'src/components/ui';
import { InstallmentsPaymentMinDaysInfo } from '../InstallmentsPaymentMinDaysInfo';

type Props = {
  stock: IStock;
  rent?: MyRentDetails;
};

const StyledHeader = styled('h4')({
  margin: '10px 0',
  fontWeight: 700,
  fontSize: '1.1rem',
});

export const PaymentType = ({ stock, rent }: Props) => {
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
      <Header variant="h2">{__('application.paymentType')}</Header>
      <p>{__(getPaymentTypeText(stock.clientPaymentTypeConfig, rent))}</p>

      {[StockPaymentType.Both, StockPaymentType.Installments].includes(
        stock.clientPaymentTypeConfig,
      ) ? (
        <InstallmentsPaymentMinDaysInfo />
      ) : null}

      {(!rent || (rent && rent.status === RentStatus.rented)) &&
      stock.clientPaymentTypeConfig === StockPaymentType.Both ? (
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
