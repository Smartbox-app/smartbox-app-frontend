import { useDispatch } from 'react-redux';
import { PaymentStatus } from 'smartbox-types';
import { hideModal } from 'src/actions/modal';
import { Button, Header, Stack, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { SuccessCheck } from 'src/icons';
import styled from 'styled-components';

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing * 4,
}));

export type PaymentModalProps = {
    status?: PaymentStatus;
}

export const PaymentModal = ({status}: PaymentModalProps) => {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(hideModal());
  };

  const getHeader = () => {
    switch(status) {
        case PaymentStatus.wait:
            return __("application.paymentPending");
          case PaymentStatus.accepted:
            return __("application.paymentSuccesful");
          case PaymentStatus.failure:
            return __("application.paymentFailed");
          default:
            return __("application.paymentError");
    }
  }

  return (
    <Content>
      {status === PaymentStatus.accepted ? <SuccessCheck /> : null}
      <Header variant="h2">{getHeader()}</Header>
      {status === PaymentStatus.accepted ? (
          <>
            <Typography>{__("application.thanks")}</Typography>
            <Typography>{__("application.invoiceWasSent")}</Typography>
          </>
        ) : null}
      <Button size="large" text="application.backToApp" onClick={closeModal} />
    </Content>
  );
};
