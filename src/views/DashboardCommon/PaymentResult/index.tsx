import { PaymentDetails, PaymentStatus } from 'smartbox-types';

import { __ } from '../../../helpers/i18n';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Header, InfoContent, Typography } from 'src/components/ui';
import { SuccessCheck } from 'src/icons';
import { useLocation, useParams } from 'react-router';
import { Logo, Spinner } from 'src/components/Branded';
import { history } from 'src/history';

import { useTracking } from 'src/hooks/useTracking';
import {
  useGetMyDetailsQuery,
  usePaymentDetailsQuery,
  usePaymentStatusQuery,
} from 'src/queries';

const PAYMENT_POLL_MS = 3000;

export const PaymentResult = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const source = new URLSearchParams(location.search).get('source');
  const tracked = useRef<boolean>(false);
  const { trackPurchase } = useTracking();
  const { data: user, isFetched: isUserFetched } = useGetMyDetailsQuery();

  const [statusPollMs, setStatusPollMs] = useState<number | false>(
    PAYMENT_POLL_MS,
  );
  const [detailsPollMs, setDetailsPollMs] = useState<number | false>(
    PAYMENT_POLL_MS,
  );

  const handleTrackPurchase = (
    details: PaymentDetails,
    email?: string,
    userId?: string,
  ) => {
    if (tracked.current) return;
    trackPurchase({ paymentId: id, details, email, userId });
    tracked.current = true;
  };

  const {
    data: paymentStatus,
    isError: paymentStatusError,
    isPending: paymentStatusPending,
  } = usePaymentStatusQuery(id, {
    refetchInterval: statusPollMs,
  });

  const { data: paymentDetails, isError: paymentDetailsError } =
    usePaymentDetailsQuery(id, {
      refetchInterval: detailsPollMs,
    });

  useEffect(() => {
    if (paymentStatusError || paymentStatus === PaymentStatus.accepted) {
      setStatusPollMs(false);
    }
  }, [paymentStatus, paymentStatusError]);

  useEffect(() => {
    if (
      paymentDetailsError ||
      paymentDetails?.status === PaymentStatus.accepted
    ) {
      setDetailsPollMs(false);
    }
  }, [paymentDetails, paymentDetailsError]);

  useEffect(() => {
    if (paymentDetails?.status !== PaymentStatus.accepted) return;

    const email = user?.email;
    if (!email && !user?.id && !isUserFetched) return;

    handleTrackPurchase(paymentDetails, email, user?.id);
  }, [paymentDetails, user?.email, user?.id, isUserFetched]);

  const getHeader = () => {
    if (paymentStatusError) return __('application.paymentError');
    switch (paymentStatus) {
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

  const handleClick = () => {
    history.push('/');
  };

  if (paymentStatusPending && !paymentStatusError)
    return (
      <InfoContent>
        <Spinner transparent />
      </InfoContent>
    );

  return (
    <InfoContent>
      <Logo />
      {paymentStatus === PaymentStatus.accepted ? <SuccessCheck /> : null}
      <Header variant="h2">{getHeader()}</Header>
      {paymentStatus === PaymentStatus.accepted ? (
        <>
          <Typography>{__('application.thanks')}</Typography>
          <Typography>{__('application.invoiceWasSent')}</Typography>
        </>
      ) : null}

      {source === 'mobile' ? (
        <Typography>
          {__('application.youCanCloseThisPageAndGoBack')}
        </Typography>
      ) : (
        <Button
          size="large"
          text="application.backToApp"
          onClick={handleClick}
        />
      )}
    </InfoContent>
  );
};
