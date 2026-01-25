import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PaymentStatus } from 'smartbox-types';
import { hideModal } from 'src/actions/modal';
import { Button, Header, Stack, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { SuccessCheck } from 'src/icons';
import styled from 'styled-components';
import ApiService from '../../../../services/api-service';
import { Spinner } from '../../../../components/Branded';

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing * 4,
}));

export type PaymentModalProps = {
  id?: string;
  status?: PaymentStatus;
};

export const PaymentModal = ({ status, id }: PaymentModalProps) => {
  const dispatch = useDispatch();
  const intervalRef = useRef<number>();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  const closeModal = () => {
    dispatch(hideModal());
  };

  const getPaymentStatus = async () => {
    await ApiService.callFetch('GET', `payment/${id}`, (response: string) => {
      setPaymentStatus(parseInt(response) as PaymentStatus);
    });
  };

  useEffect(() => {
    if (!id) return;

    getPaymentStatus();

    const interval = setInterval(() => {
      getPaymentStatus();
    }, 3000);

    intervalRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  useEffect(() => {
    if (intervalRef.current && paymentStatus === PaymentStatus.accepted) {
      clearInterval(intervalRef.current);
    }
  }, [paymentStatus]);

  const normalizedStatus = paymentStatus === null ? status :  paymentStatus;

  const getHeader = () => {
    switch (normalizedStatus) {
      case PaymentStatus.wait:
        return __('application.paymentPending');
      case PaymentStatus.accepted:
        return __('application.paymentSuccesful');
      case PaymentStatus.failure:
        return __('application.paymentFailed');
      default:
        return __('application.paymentError');
    }
  };

  if (normalizedStatus === null)
    return (
      <Content>
        <Spinner transparent />
      </Content>
    );

  return (
    <Content>
      {normalizedStatus === PaymentStatus.accepted ? <SuccessCheck /> : null}
      <Header variant="h2">{getHeader()}</Header>
      {normalizedStatus === PaymentStatus.accepted ? (
        <>
          <Typography>{__('application.thanks')}</Typography>
          <Typography>{__('application.invoiceWasSent')}</Typography>
        </>
      ) : null}
      <Button size="large" text="application.backToApp" onClick={closeModal} />
    </Content>
  );
};
