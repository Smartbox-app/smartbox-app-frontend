import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import {
  RentBoxReq,
  ExtendRentalReq,
  OrderAddons,
  RentPaymentType,
  PayForRentResponse,
  PaymentStatus,
  PaymentDocument,
} from 'smartbox-types';
import { PaymentType } from 'smartbox-types';
import { Alert } from '../../../../../components/Common';
import { Spinner } from '../../../../../components/Branded';
import { order } from '../../../../../actions';
import {
  ButtonsContainer,
  SectionHeader,
} from '../../../../../components/Layout';
import { history } from 'src/history';
import { FormType } from '../../../../../types/order-form';

import UserService from '../../../../../services/user-service';

import ScrollPosition from './ScrollPosition';
import { ApplicationState } from '../../../../../reducers';

import './StepAgreement.scss';
import ApiService from '../../../../../services/api-service';
import {
  getCorrectPriceWithTax,
  getCorrectPriceWithTaxForArray,
  getCorrectTaxPercentAmount,
} from '../../../../../utils/tax';
import { OrderAddon } from '../../../../../reducers/order-reducer';
import { dateOnly } from '../../../../../utils/format-date';
import { useGetDocumentByTypeQuery, useGetMyDetailsQuery } from 'src/queries';
import { Button, Section, Stack } from 'src/components/ui';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { prepareAndSentPaymentForm } from 'src/utils/payment-form';
import { format } from 'date-fns';
import { textToSimpleMD } from 'src/utils/text-to-simple-md';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import {
  AgreementPreview,
  LegacyAgreementPreview,
} from 'src/components/AgreementPreview';
import { __ } from 'src/helpers/i18n';

interface Props {
  formData: FormType;
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
  stockId: string;
  paymentType: PaymentType;
}

const StepAgreement = ({ formData, isResignationMarked }: Props): any => {
  const { data: user } = useGetMyDetailsQuery();
  const order = useSelector((state: ApplicationState) => state.order);
  const tenant = useSelector((state: ApplicationState) => state.tenant);
  const [loading, setLoading] = useState(false);

  const { rentId } = useParams<{ step: string; rentId?: string }>();
  useEffect(() => {
    if (!user) return;
    if (!order.boxGroupId && !rentId) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
    }
  }, []);

  const startNewRent = async (data: FormData, tenantId: string) => {
    setLoading(true);
    try {
      await ApiService.callFetch(
        'POST',
        `rent/new?source=${Capacitor.isNativePlatform() ? 'mobile' : 'web'}`,
        (response: PayForRentResponse) => {
          if (response.paymentStatus === PaymentStatus.succes) {
            history.push(`/payment-success/${response.paymentId}`);
          } else {
            if (Capacitor.isNativePlatform()) {
              history.push('/');
              Browser.open({
                url: `${ApiService.url}rent/ipg-redirect/${tenantId}/${response.paymentId}`,
              });
            } else {
              prepareAndSentPaymentForm(response);
            }
          }
        },
        null,
        data,
      );
    } catch (e) {
      console.log('ERROR IN TRYING TO START NEW RENT', e);
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
        if (response.paymentStatus === PaymentStatus.succes) {
          history.push(`/payment-success/${response.paymentId}`);
        } else {
          if (Capacitor.isNativePlatform()) {
            history.push('/');
            Browser.open({
              url: `${ApiService.url}rent/ipg-redirect/${tenantId}/${response.paymentId}`,
            });
          } else {
            prepareAndSentPaymentForm(response);
          }
        }
      },
      null,
      data,
    );
    setLoading(false);
  };

  const getCorrectPrice = (
    price: { value: number }[],
    isGross: boolean,
    tax: string,
  ) => {
    if (isGross) return price.reduce((acc, curr) => acc + curr.value, 0);
    const taxValue = getCorrectTaxPercentAmount(tax);

    const priceWithTax = price.map((p) =>
      getCorrectPriceWithTax(p.value, taxValue),
    );

    return priceWithTax.reduce((acc, curr) => acc + curr, 0);
  };

  const getAddonsWithCorrectPrice = (orderAddons: {
    [addonId: string]: OrderAddon;
  }): OrderAddons => {
    const parsedAddons: OrderAddons = {};

    Object.keys(orderAddons).forEach((addonId) => {
      const addon = orderAddons[addonId];
      const taxValue = getCorrectTaxPercentAmount(addon.tax);
      // if (addon.price?.value && addon.selectedVariant) {

      const totalAddonPrice = (addon.price || []).reduce(
        (acc, curr) => acc + curr.value,
        0,
      );

      parsedAddons[addonId] = {
        name: addon.name,
        slug: addon.slug,
        tax: addon.tax,
        acceptancesStatus: addon.acceptancesStatus,
        acceptances: addon.acceptances,
        price: addon.price
          ? addon.price[0].isGross
            ? totalAddonPrice
            : getCorrectPriceWithTaxForArray(addon.price, taxValue)
          : null,
        selectedVariant: addon.selectedVariant,
        selectedVariantName: addon.selectedVariantName,
      };
      // }
    });

    return parsedAddons;
  };

  const getSimplifiedAddons = (addons: OrderAddons) => {
    const simplified: {
      slug: string;
      variant: string | null;
      price: number | null;
    }[] = [];
    Object.keys(addons).forEach((addonId) => {
      const addon = addons[addonId];
      simplified.push({
        slug: addon.slug,
        variant: addon.selectedVariantName,
        price: addon.price,
      });
    });

    return simplified;
  };

  const { handleSubmit } = useForm();

  const formatOnlyDate = (date: Date) => format(date, 'yyyy-MM-dd');

  const getFormDataFromCollection = (
    collection: RentBoxReq | ExtendRentalReq,
  ): FormData => {
    const rentFormData = new FormData();

    for (const key in collection) {
      const value = collection[key];
      if (key === 'startAt') rentFormData.append(key, formatOnlyDate(value));
      else if (key === 'finishAt')
        rentFormData.append(key, formatOnlyDate(value));
      else if (key === 'orderAddons')
        rentFormData.append(key, JSON.stringify(value));
      else rentFormData.append(key, value);
    }

    for (const addonId of Object.keys(order.orderAddons)) {
      const orderAddon = order.orderAddons[addonId];

      if (orderAddon && orderAddon.file) {
        rentFormData.append(
          'addonFiles',
          orderAddon.file,
          `${addonId}--${orderAddon.file.name}`,
        );
      }
    }

    return rentFormData;
  };

  const onSubmit = () => {
    if (!user || !order.endDate) return;


    const commonCollection = {
      finishAt: order.endDate,
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
      rentPaymentType: order.rentPaymentType || RentPaymentType.InAdvance,
      paymentDocument: order.paymentDocumentType || PaymentDocument.Invoice,
      orderAddons: getAddonsWithCorrectPrice(order.orderAddons),
    };

    if (formData.birthDate) {
      commonCollection['birthDate'] = formData.birthDate;
    }

    if (formData.clientSource) {
      commonCollection['clientSource'] = formData.clientSource;
    }

    const dataCollectionExtendRent: ExtendRentalReq = {
      ...commonCollection,
    };

    const dataCollectionRent: RentBoxReq = {
      ...commonCollection,
      startAt: order.startDate,
      stockId: order.stockId,
      boxGroupId: order.boxGroupId,
    };

    if (!tenant) return;

    if (rentId) {
      // rent extension
      const rentFormData = getFormDataFromCollection(dataCollectionExtendRent);
      extendRent(rentFormData, rentId, tenant.id);
    } else {
      // new Rent
      const rentFormData = getFormDataFromCollection(dataCollectionRent);
      startNewRent(rentFormData, tenant?.id);
    }
  };

  const getValuesForAgreement = () => {
    return {
      finishAt: order.endDate ? dateOnly(order.endDate) : null,
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
      simplifiedAddons: getSimplifiedAddons(
        getAddonsWithCorrectPrice(order.orderAddons),
      ),
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

  const { data: agreementDocument, isLoading: isAgreementDocumentLoading } =
    useGetDocumentByTypeQuery('agreement');

  if (!tenant) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loading ? <Spinner overlay halfTransparent /> : null}
      <Stack>
        <Section>
          <SectionHeader title="application.orderAgreement" />

          {isAgreementDocumentLoading ? (
            <Spinner overlay halfTransparent />
          ) : agreementDocument ? (
            <AgreementPreview source="template" template={agreementTemplate} />
          ) : (
            <LegacyAgreementPreview
              tenantId={tenant.id}
              agreementFile={tenant.agreement}
              template={agreementTemplate}
            />
          )}
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
              disabled={!isResignationMarked || loading}
            />
          </ButtonsContainer>
        </Section>
      </Stack>
    </form>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  isResignationMarked: state.order.isResignationMarked,
  stockId: state.order.formData.stock,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(StepAgreement);
