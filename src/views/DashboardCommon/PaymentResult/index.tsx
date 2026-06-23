import { PaymentDetails, PaymentStatus } from 'smartbox-types';

import { __ } from '../../../helpers/i18n';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Header, InfoContent, Typography } from 'src/components/ui';
import { SuccessCheck } from 'src/icons';
import { useParams } from 'react-router';
import ApiService from 'src/services/api-service';
import { Logo, Spinner } from 'src/components/Branded';
import TagManager from 'react-gtm-module';
import { history } from 'src/history';

export const PaymentResult = () => {
  const { id } = useParams<{ id: string }>();
  const tracked = useRef<boolean>(false);

  const trackPurchase = (details: PaymentDetails) => {
    if (tracked.current) return;
    const { rentGrossPrice, addons, type, name, groupId, area } = details;

    const addonsPrice = addons
      .filter((addon) => !isNaN(Number(addon.grossPrice)))
      .reduce((acc, curr) => acc + Number(curr.grossPrice), 0);

    const totalPrice = rentGrossPrice + addonsPrice;

    TagManager.dataLayer({
      dataLayer: {
        event: 'purchase',
        ecommerce: {
          transaction_id: id,
          value: totalPrice,
          currency: 'PLN',
          items: [
            {
              item_id: groupId,
              item_name: `${name} - ${area}m²`,
              item_category: type,
              price: rentGrossPrice,
              quantity: 1,
            },
            addons.map((addon) => ({
              item_id: addon.slug,
              item_price: addon.grossPrice,
              item_name: addon.name,
            })),
          ],
        },
      },
    });
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

      trackPurchase(paymentDetails);
    }
  }, [paymentDetails]);

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
      <Button
        size="large"
        text="application.backToApp"
        onClick={() => history.push('/')}
      />
    </InfoContent>
  );
};
