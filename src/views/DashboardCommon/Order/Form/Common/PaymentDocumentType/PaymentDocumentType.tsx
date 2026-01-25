import { __ } from '../../../../../../helpers/i18n';
import {
  PaymentDocument,
  RentPaymentType,
  StockPaymentDocument,
  StockRes,
} from 'smartbox-types';
import { Header, Section } from 'src/components/ui';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from 'src/reducers';
import { setRentPaymentDocumentType } from 'src/actions/order';
import { ChangeEvent, useMemo } from 'react';
import { AsterixRequired, Input } from 'src/components/Common';

type Props = {
  stock: StockRes;
};

export const PaymentDocumentType = ({ stock }: Props) => {
  const documentType = useSelector(
    (state: ApplicationState) => state.order.paymentDocumentType,
  );
  const rentPaymentType = useSelector(
    (state: ApplicationState) => state.order.rentPaymentType,
  );
  const dispatch = useDispatch();

  const paymentTypeText = useMemo(() => {
    if (rentPaymentType === RentPaymentType.Installments)
      return 'application.youWillGetInvoice';
    switch (stock.paymentDocumentConfig) {
      case StockPaymentDocument.Both:
        return '';
      case StockPaymentDocument.Invoice:
        return 'application.youWillGetInvoice';
      case StockPaymentDocument.Receipt:
        return 'application.youWillGetReceipt';
    }
  }, [rentPaymentType, stock.paymentDocumentConfig]);

  return (
    <Section>
      <Header variant="h2">{__('application.paymentDocument')} <AsterixRequired /></Header>
      {paymentTypeText ? <p>{__(paymentTypeText)}</p> : null}

      {rentPaymentType !== RentPaymentType.Installments &&
      stock.paymentDocumentConfig === StockPaymentDocument.Both ? (
        <Input
          type="radio"
          required
          input={{
            name: 'priceResolveType',
            label: 'application.selectPaymentDocument',
            value: documentType,
            onChange: (e: ChangeEvent<HTMLInputElement>) =>
              dispatch(
                setRentPaymentDocumentType(e.target.value as PaymentDocument),
              ),
          }}
          options={[
            {
              label: 'application.documentReceipt',
              value: PaymentDocument.Receipt,
            },
            {
              label: 'application.documentInvoice',
              value: PaymentDocument.Invoice,
            },
          ]}
        />
      ) : null}
    </Section>
  );
};
