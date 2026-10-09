import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  RentBoxReq,
  ExtendRentalReq,
  RentPaymentType,
  RentAgreementType,
  PayForRentResponse,
  PaymentStatus,
  PaymentDocument,
} from 'smartbox-types';
import { Alert } from '../../../../../components/Common';
import { Spinner } from '../../../../../components/Branded';
import { setPendingCheckout } from '../../../../../actions/order';
import {
  ButtonsContainer,
  SectionHeader,
} from '../../../../../components/Layout';
import { history } from 'src/history';

import UserService from '../../../../../services/user-service';

import ScrollPosition from './ScrollPosition';
import { ApplicationState } from '../../../../../reducers';

import './StepAgreement.scss';
import ApiService from '../../../../../services/api-service';
import {
  getAddonsWithCorrectPrice,
  getCorrectPrice,
  getSimplifiedAddons,
} from 'src/utils/agreement-checkout-price';
import {
  appendAddonFiles,
  appendCollectionFields,
} from 'src/utils/rent-form-data';
import { dateOnly } from '../../../../../utils/format-date';
import { useGetDocumentByTypeQuery, useGetMyDetailsQuery } from 'src/queries';
import { Button, Section, Stack } from 'src/components/ui';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { redirectToIpg } from 'src/utils/payment-form';
import { format } from 'date-fns';
import { textToSimpleMD } from 'src/utils/text-to-simple-md';
import { Capacitor } from '@capacitor/core';
import {
  AgreementPreview,
  LegacyAgreementPreview,
} from 'src/components/AgreementPreview';
import { __ } from 'src/helpers/i18n';
import { getBoxGroupTypeLabel } from 'src/utils/box-group-labels';
import { useTenant } from 'src/hooks/useTenant';

const StepAgreement = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const order = useSelector((state: ApplicationState) => state.order);
  const formData = order.formData;
  const isResignationMarked = order.isResignationMarked;
  const pendingCheckout = order.pendingCheckout;
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(false);
  const creatingRentRef = useRef(false);

  const { rentId } = useParams<{ step: string; rentId?: string }>();
  const isOpenEnded = order.agreementType === RentAgreementType.OpenEnded;
  useEffect(() => {
    if (!user) return;
    if (!order.boxGroupId && !rentId) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
    }
  }, []);

  const proceedToPayment = (
    response: PayForRentResponse,
    tenantId: string,
  ) => {
    if (response.paymentStatus === PaymentStatus.accepted) {
      history.push(`/payment-success/${response.paymentId}`);
      return;
    }

    redirectToIpg(tenantId, response.paymentId);
  };

  const startNewRent = async (data: FormData) => {
    setLoading(true);
    try {
      await ApiService.callFetch(
        'POST',
        `rent/new?source=${Capacitor.isNativePlatform() ? 'mobile' : 'web'}`,
        (response: PayForRentResponse) => {
          dispatch(setPendingCheckout(response));
        },
        null,
        data,
      );
    } catch {
      // Leave checkout unset when the request fails. Loading is cleared below.
    }
    setLoading(false);
  };

  const extendRent = async (
    data: FormData,
    rentId: string,
    tenantId: string,
  ) => {
    setLoading(true);
    await ApiService.callFetch(
      'POST',
      `rent/extend-rent/${rentId}?source=${Capacitor.isNativePlatform() ? 'mobile' : 'web'}`,
      (response: PayForRentResponse) => {
        proceedToPayment(response, tenantId);
      },
      null,
      data,
    );
    setLoading(false);
  };

  const { handleSubmit } = useForm();

  const formatOnlyDate = (date: Date) => format(date, 'yyyy-MM-dd');

  const getFormDataFromCollection = (
    collection: RentBoxReq | ExtendRentalReq,
  ): FormData => {
    const rentFormData = appendCollectionFields(
      new FormData(),
      collection as unknown as Record<string, unknown>,
    );

    return appendAddonFiles(rentFormData, order.orderAddons);
  };

  const onSubmit = () => {
    if (!user) return;
    if (!isOpenEnded && !order.endDate) return;

    const commonCollection = {
      finishAt: order.endDate ? formatOnlyDate(order.endDate) : '',
      birthDate: formData.birthDate,
      clientSource: formData.clientSource,
      cost: getCorrectPrice(
        order.calculatedPrice,
        order.calculatedPrice[0].isGross,
        tenant!.tax,
      ),
      discountCode: order.discountCode,
      firstName: formData.firstName,
      lastName: formData.lastName,
      street: formData.street,
      city: formData.city,
      country: formData.country,
      postCode: formData.postCode,
      isCompany: formData.isCompany || false,
      phone: formData.phone,
      mailToSendInvoice: formData.mailToSendInvoice,
      companyName: formData.companyName || '',
      companyStreet: formData.companyStreet || '',
      companyCity: formData.companyCity || '',
      companyPostCode: formData.companyPostCode || '',
      companyCountry: formData.companyCountry || '',
      nip: formData.nip?.trim() || '',
      rentPaymentType: isOpenEnded
        ? RentPaymentType.Installments
        : order.rentPaymentType || RentPaymentType.InAdvance,
      paymentDocument: isOpenEnded
        ? PaymentDocument.Invoice
        : order.paymentDocumentType || PaymentDocument.Invoice,
      orderAddons: getAddonsWithCorrectPrice(order.orderAddons),
    };

    const dataCollectionExtendRent: ExtendRentalReq = {
      ...commonCollection,
    };

    if (!tenant) return;

    if (rentId) {
      // rent extension
      const rentFormData = getFormDataFromCollection(dataCollectionExtendRent);
      extendRent(rentFormData, rentId, tenant.id);
    } else if (pendingCheckout) {
      proceedToPayment(pendingCheckout, tenant.id);
    }
  };

  const getValuesForAgreement = () => {
    const finishAt = isOpenEnded
      ? ''
      : (order.endDate && dateOnly(order.endDate)) || null;

    return {
      finishAt,
      cost: getCorrectPrice(
        order.calculatedPrice,
        order.calculatedPrice[0].isGross,
        tenant!.tax,
      ).toString(),
      // discountCode: order.discountCode,
      firstName: formData.firstName,
      lastName: formData.lastName,
      street: formData.street,
      city: formData.city,
      postCode: formData.postCode,
      isCompany: formData.isCompany ? 'true' : 'false',
      phone: formData.phone,
      birthDate: formData.birthDate ? dateOnly(formData.birthDate) : '',
      mailToSendInvoice: formData.mailToSendInvoice,
      companyName: formData.companyName || undefined,
      companyStreet: formData.companyStreet || undefined,
      companyCity: formData.companyCity || undefined,
      companyPostCode: formData.companyPostCode || undefined,
      nip: formData.nip?.trim() || undefined,
      simplifiedAddons: getSimplifiedAddons(order.orderAddons),
      date: dateOnly(new Date()),
      startAt: dateOnly(order.startDate),
      email: user?.email || undefined,
      size: order.boxGroupName,
      area: order.boxGroupArea,
      stockName: order.stockName,
      stockAddress: order.stockAddress,
    };
  };

  const onBack = () => {
    if (!user) return;
    history.push(
      `/${UserService.getSlugByRole(user.role)}/order/step/summary/${rentId || ''}`,
    );
  };

  const agreementTemplate = useMemo(() => {
    const { simplifiedAddons, ...values } = getValuesForAgreement();

    return {
      ...values,
      addons: simplifiedAddons,
    };
  }, [formData, order, tenant, user]);

  useEffect(() => {
    if (rentId || pendingCheckout?.rentId) return;
    if (!user || !tenant || !order.boxGroupId) return;
    if (!isOpenEnded && !order.endDate) return;
    if (isOpenEnded && !order.startDate) return;
    if (creatingRentRef.current) return;

    creatingRentRef.current = true;

    const commonCollection = {
      finishAt: order.endDate ? formatOnlyDate(order.endDate) : '',
      birthDate: formData.birthDate,
      clientSource: formData.clientSource,
      cost: getCorrectPrice(
        order.calculatedPrice,
        order.calculatedPrice[0].isGross,
        tenant.tax,
      ),
      discountCode: order.discountCode,
      firstName: formData.firstName,
      lastName: formData.lastName,
      street: formData.street,
      city: formData.city,
      country: formData.country,
      postCode: formData.postCode,
      isCompany: formData.isCompany || false,
      phone: formData.phone,
      mailToSendInvoice: formData.mailToSendInvoice,
      companyName: formData.companyName || '',
      companyStreet: formData.companyStreet || '',
      companyCity: formData.companyCity || '',
      companyPostCode: formData.companyPostCode || '',
      companyCountry: formData.companyCountry || '',
      nip: formData.nip?.trim() || '',
      rentPaymentType: isOpenEnded
        ? RentPaymentType.Installments
        : order.rentPaymentType || RentPaymentType.InAdvance,
      paymentDocument: isOpenEnded
        ? PaymentDocument.Invoice
        : order.paymentDocumentType || PaymentDocument.Invoice,
      orderAddons: getAddonsWithCorrectPrice(order.orderAddons),
    };

    const dataCollectionRent: RentBoxReq = {
      ...commonCollection,
      startAt: formatOnlyDate(order.startDate),
      stockId: order.stockId,
      boxGroupId: order.boxGroupId,
      agreementType: order.agreementType || RentAgreementType.FixedTerm,
      ...(isOpenEnded ? { finishAt: null } : {}),
    };

    startNewRent(getFormDataFromCollection(dataCollectionRent)).finally(
      () => {
        creatingRentRef.current = false;
      },
    );
  }, [user, tenant, rentId, pendingCheckout?.rentId, order.boxGroupId, order.endDate]);

  const { data: agreementDocument, isLoading: isAgreementDocumentLoading } =
    useGetDocumentByTypeQuery('agreement', order.stockId);

  if (!tenant) return null;

  const renderAgreementPreview = () => {
    const legacyPreview = (
      <LegacyAgreementPreview
        tenantId={tenant.id}
        agreementFile={tenant.agreement}
        template={agreementTemplate}
      />
    );

    if (pendingCheckout?.rentId && !rentId) {
      return (
        <AgreementPreview
          source="rent"
          rentId={pendingCheckout.rentId}
          periodIndex={0}
          fallback={legacyPreview}
        />
      );
    }

    if (isAgreementDocumentLoading || loading) {
      return <Spinner overlay halfTransparent />;
    }

    if (agreementDocument) {
      return (
        <AgreementPreview
          source="template"
          template={agreementTemplate}
          stockId={order.stockId}
        />
      );
    }

    return legacyPreview;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loading ? <Spinner overlay halfTransparent /> : null}
      <Stack>
        <Section>
          <SectionHeader title="application.orderAgreement" />
          {pendingCheckout?.rentId ? (
            <Alert type="notice">
              {__('application.orderAssignedBox', {
                type: getBoxGroupTypeLabel(order.boxGroupType),
              })}
            </Alert>
          ) : null}

          {renderAgreementPreview()}
        </Section>
        <Section>
          <Alert type="notice" text="application.orderAgreementAcceptation" />
          <ScrollPosition />
        </Section>
        <Section>
          {tenant?.paymentDisclaimer ? (
            <Alert type="notice">
              {textToSimpleMD(tenant.paymentDisclaimer)}
            </Alert>
          ) : null}
          <ButtonsContainer spaceBetween>
            <Button
              size="large"
              variant="secondary"
              type="button"
              text="application.back"
              onClick={() => onBack()}
              iconLeft={<ArrowLeft />}
            />
            <Button
              iconRight={<ArrowRight />}
              type="submit"
              size="large"
              text="application.goToPayment"
              disabled={
                !isResignationMarked ||
                loading ||
                (!rentId && !pendingCheckout)
              }
            />
          </ButtonsContainer>
        </Section>
      </Stack>
    </form>
  );
};

export default StepAgreement;
