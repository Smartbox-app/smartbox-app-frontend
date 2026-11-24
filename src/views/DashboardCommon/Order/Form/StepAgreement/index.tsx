import { format } from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  RentBoxReq,
  ExtendRentalReq,
  RentPaymentType,
  RentAgreementType,
  PayForRentResponse,
  PaymentStatus,
  PaymentDocument,
} from 'smartbox-types';
import { setPendingCheckout } from 'src/actions/order';
import {
  AgreementPreview,
  LegacyAgreementPreview,
} from 'src/components/AgreementPreview';
import { Spinner } from 'src/components/Branded';
import { Alert } from 'src/components/Common';
import {
  ButtonsContainer,
  SectionHeader,
} from 'src/components/Layout';
import { Button, Section, Stack } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useTenant } from 'src/hooks/useTenant';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { useCreateRentMutation, useExtendRentMutation } from 'src/mutations';
import {
  useGetDocumentByTypeQuery,
  useGetMyDetailsQuery,
  useMyRentDetailsQuery,
} from 'src/queries';
import { ApplicationState } from 'src/reducers';
import { OrderLoadError } from 'src/views/DashboardCommon/Order/OrderLoadError';
import { useOrderStep } from 'src/views/DashboardCommon/Order/RouteWithIndicator';
import { useOrderPaths } from 'src/views/DashboardCommon/Order/useOrderPaths';
import { useOrderSelection } from 'src/views/DashboardCommon/Order/useOrderSelection';
import {
  getAddonsWithCorrectPrice,
  getCorrectPrice,
  getSimplifiedAddons,
} from 'src/utils/agreement-checkout-price';
import { getBoxGroupTypeLabel } from 'src/utils/box-group-labels';
import { dateOnly } from 'src/utils/format-date';
import { redirectToIpg } from 'src/utils/payment-form';
import {
  appendAddonFiles,
  appendCollectionFields,
} from 'src/utils/rent-form-data';
import { textToSimpleMD } from 'src/utils/text-to-simple-md';

import ScrollPosition from './ScrollPosition';

import './StepAgreement.scss';

const StepAgreement = () => {
  useOrderStep('agreement');
  const { data: user } = useGetMyDetailsQuery();
  const { goToStockSelect, goToSummary } = useOrderPaths();
  const dispatch = useDispatch();
  const order = useSelector((state: ApplicationState) => state.order);
  const formData = order.formData;
  const isResignationMarked = order.isResignationMarked;
  const pendingCheckout = order.pendingCheckout;
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(false);
  const creatingRentRef = useRef(false);
  const { mutateAsync: createRent } = useCreateRentMutation();
  const { mutateAsync: extendRentMutate } = useExtendRentMutation();

  const {
    rentId,
    stockId: pathStockId,
    boxGroupId: pathBoxGroupId,
  } = useParams<{
    rentId?: string;
    stockId?: string;
    boxGroupId?: string;
  }>();
  const { data: rent } = useMyRentDetailsQuery(rentId);
  const stockId = pathStockId || rent?.stockId;
  const boxGroupId = pathBoxGroupId || rent?.boxGroupId;
  const { stock, boxGroup, pending, failed } = useOrderSelection(
    stockId,
    boxGroupId,
  );
  const isOpenEnded = order.agreementType === RentAgreementType.OpenEnded;
  useEffect(() => {
    if (!user || rentId) return;
    if (!pathStockId || !pathBoxGroupId) goToStockSelect();
  }, [goToStockSelect, pathBoxGroupId, pathStockId, rentId, user]);

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
      const response = await createRent(data);
      if (response) {
        dispatch(setPendingCheckout(response));
      }
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
    try {
      const response = await extendRentMutate({ rentId, body: data });
      if (response) {
        proceedToPayment(response, tenantId);
      }
    } catch {
      // Payment redirect is skipped when the request fails.
    }
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
    const area =
      boxGroup?.area != null ? String(boxGroup.area) : String(rent?.size ?? '');

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
      size: boxGroup?.name || '',
      area,
      stockName: stock?.name || rent?.stockName || '',
      stockAddress: stock?.address || rent?.stockAddress || '',
    };
  };

  const onBack = () => {
    if (!user) return;
    if (rentId) goToSummary({ rentId });
    else if (pathStockId && pathBoxGroupId) {
      goToSummary({ stockId: pathStockId, boxGroupId: pathBoxGroupId });
    } else {
      goToStockSelect();
    }
  };

  const agreementTemplate = useMemo(() => {
    const { simplifiedAddons, ...values } = getValuesForAgreement();

    return {
      ...values,
      addons: simplifiedAddons,
    };
  }, [boxGroup, formData, order, rent, stock, tenant, user]);

  useEffect(() => {
    if (rentId || pendingCheckout?.rentId) return;
    if (pending || failed) return;
    if (!user || !tenant || !stockId || !boxGroupId) return;
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
      stockId,
      boxGroupId,
      agreementType: order.agreementType || RentAgreementType.FixedTerm,
      ...(isOpenEnded ? { finishAt: null } : {}),
    };

    startNewRent(getFormDataFromCollection(dataCollectionRent)).finally(
      () => {
        creatingRentRef.current = false;
      },
    );
  }, [
    failed,
    pending,
    user,
    tenant,
    rentId,
    pendingCheckout?.rentId,
    boxGroupId,
    order.endDate,
  ]);

  const { data: agreementDocument, isLoading: isAgreementDocumentLoading } =
    useGetDocumentByTypeQuery('agreement', stockId);

  if (pathStockId && pathBoxGroupId && pending) return null;
  if (pathStockId && pathBoxGroupId && failed) return <OrderLoadError />;

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
          stockId={stockId}
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
                type: getBoxGroupTypeLabel(boxGroup?.type ?? rent?.boxGroupType),
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
