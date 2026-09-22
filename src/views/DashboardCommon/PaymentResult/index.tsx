import { PaymentDetails, PaymentStatus } from 'smartbox-types';

import { __ } from '../../../helpers/i18n';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Header, InfoContent, Typography } from 'src/components/ui';
import { SuccessCheck } from 'src/icons';
import { useLocation, useParams } from 'react-router';
import ApiService from 'src/services/api-service';
import { Logo, Spinner } from 'src/components/Branded';
import { history } from 'src/history';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { useTracking } from 'src/hooks/useTracking';
import { useGetMyDetailsQuery } from 'src/queries';

export const PaymentResult = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const source = new URLSearchParams(location.search).get('source');
  const tracked = useRef<boolean>(false);
  const { trackPurchase } = useTracking();
  const { data: user, isFetched: isUserFetched } = useGetMyDetailsQuery();

  const handleTrackPurchase = (
    details: PaymentDetails,
    email?: string,
    userId?: string,
  ) => {
    if (tracked.current) return;
    trackPurchase({ paymentId: id, details, email, userId });
    tracked.current = true;
  };

  const statusIntervalRef = useRef<number | null>(null);
  const detailsIntervalRef = useRef<number | null>(null);

  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null,
  );
  const [detailsUnaivalable, setDetailsUnavailable] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );
  const [paymentStatusError, setPaymentStatusError] = useState<boolean>(false);

  const getPaymentStatus = async () => {
    try {
      await ApiService.callFetch(
        'GET',
        `payment/${id}`,
        (response: PaymentStatus) => {
          setPaymentStatus(response);
        },
        () => {
          setPaymentStatusError(true);
        },
        undefined,
        true,
        true,
      );
    } catch (e) {
      setPaymentStatusError(true);
    }
  };

  const getPaymentDetails = async () => {
    try {
      await ApiService.callFetch(
        'GET',
        `payment/details/${id}`,
        (response: PaymentDetails) => {
          setPaymentDetails(response);
        },
        () => {
          setDetailsUnavailable(true);
          setPaymentDetails(null);
        },
        undefined,
        true,
        true,
      );
    } catch (e) {
      setDetailsUnavailable(true);
      setPaymentDetails(null);
    }
  };

  useEffect(() => {
    if (!id) return;

    getPaymentStatus();
    getPaymentDetails();

    const detailsInterval = setInterval(() => {
      getPaymentDetails();
    }, 3000);

    const statusInterval = setInterval(() => {
      getPaymentStatus();
    }, 3000);

    statusIntervalRef.current = statusInterval;
    detailsIntervalRef.current = detailsInterval;

    return () => {
      clearInterval(statusInterval);
      clearInterval(detailsInterval);
    };
  }, [id]);

  useEffect(() => {
    if (
      detailsIntervalRef.current &&
      paymentDetails?.status === PaymentStatus.accepted
    ) {
      clearInterval(detailsIntervalRef.current);
    }
  }, [paymentDetails]);

  useEffect(() => {
    if (paymentDetails?.status !== PaymentStatus.accepted) return;

    const email = paymentDetails.mailToSendInvoice || user?.email;
    if (!email && !user?.id && !isUserFetched) return;

    handleTrackPurchase(paymentDetails, email, user?.id);
  }, [paymentDetails, user?.email, isUserFetched]);

  useEffect(() => {
    if (statusIntervalRef.current && paymentStatus === PaymentStatus.accepted) {
      clearInterval(statusIntervalRef.current);
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (!detailsUnaivalable) return;

    if (detailsIntervalRef.current) clearInterval(detailsIntervalRef.current);
  }, [detailsUnaivalable]);

  useEffect(() => {
    if (!paymentStatusError) return;

    if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    if (detailsIntervalRef.current) clearInterval(detailsIntervalRef.current);
  }, [paymentStatusError]);

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

  if (paymentStatus === null && !paymentStatusError)
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
