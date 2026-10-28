import React, { useEffect, useState } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  PaymentDocument,
  RentAgreementType,
  RentPaymentType,
  StockPaymentDocument,
} from 'smartbox-types';
import {
  setBirthDate,
  setRentPaymentDocumentType,
  updateFormData,
} from 'src/actions/order';
import { Spinner } from 'src/components/Branded';
import {
  Alert,
  CheckBox as ControlledCheckbox,
} from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import {
  CheckBox,
  Button,
  Section,
  Header,
  Stack,
  Form,
} from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useBridgeCalculatedPriceToRedux } from 'src/hooks/useBridgeOrderPriceQuery';
import { useTenant } from 'src/hooks/useTenant';
import { useI18n } from 'src/i18n';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { useGetMyDetailsQuery, useMyRentDetailsQuery } from 'src/queries';
import {
  useBoxGroupPriceQuery,
  usePriceForRentQuery,
} from 'src/queries/useRentPriceQueries';
import { ApplicationState } from 'src/reducers';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import UserService from 'src/services/user-service';
import { openEndedFirstPeriodFinish } from 'src/utils/open-ended-period';
import { scrollToFirstFormError } from 'src/utils/scroll-to-form-error';
import { textToSimpleMD } from 'src/utils/text-to-simple-md';

import { PaymentDocumentType } from '../Common/PaymentDocumentType';
import { ClientSourceForm } from './ClientSourceForm';
import { CompanyDetailsForm } from './CompanyDetailsForm';
import { DiscountForm } from './DiscountForm';
import { DiscountsList } from './DiscountsList';
import SummaryTable from './SummaryTable';
import TenantDetailsForm from './TenantDetailsForm';
import { RentDataDto } from './TenantDetailsForm/dto/RentDataDto';

const STEP_SUMMARY_FIELD_ORDER: (keyof RentDataDto)[] = [
  'firstName',
  'lastName',
  'birthDate',
  'country',
  'street',
  'city',
  'postCode',
  'mailToSendInvoice',
  'phone',
  'invoiceNeeded',
  'companyCountry',
  'companyName',
  'companyStreet',
  'companyCity',
  'companyPostCode',
  'nip',
  'clientSource',
];

const StepSummary = () => {
  const { tenant } = useTenant();
  const { t } = useI18n();
  const dispatch = useDispatch();
  const {
    stock,
    calculatedPrice,
    addons,
    orderAddons,
    loadingPrice,
    discountCode,
    stockId,
    boxGroupId,
    startDate,
    endDate,
    rentPaymentType,
    agreementType,
  } = useSelector((state: ApplicationState) => state.order);

  const { data: user } = useGetMyDetailsQuery();
  const { rentId } = useParams<{ step: string; rentId: string }>();
  const isOpenEnded = agreementType === RentAgreementType.OpenEnded;
  const pricePaymentType = isOpenEnded
    ? RentPaymentType.InAdvance
    : rentPaymentType || RentPaymentType.InAdvance;
  const periodDays = stock?.openEndedPeriodDays || 30;
  const firstPeriodEnd =
    isOpenEnded && startDate
      ? openEndedFirstPeriodFinish(startDate, periodDays)
      : endDate;
  const isFirstRent = user && !user.rentCount;
  const [discount, setDiscount] = useState<boolean>(false);
  const { data: rent } = useMyRentDetailsQuery(rentId);

  const extensionPriceEnabled = !!rentId && !!endDate && !isOpenEnded;
  const newRentPriceEnabled =
    !rentId &&
    !!boxGroupId &&
    (isOpenEnded || !!endDate) &&
    !!stockId;

  const boxGroupPriceQuery = useBoxGroupPriceQuery({
    boxGroupId,
    start: startDate,
    end: endDate ?? undefined,
    type: pricePaymentType,
    code: discountCode,
    openEnded: isOpenEnded,
    enabled: newRentPriceEnabled,
  });

  const rentPriceQuery = usePriceForRentQuery({
    rentId,
    start: startDate,
    end: endDate ?? undefined,
    type: rentPaymentType || RentPaymentType.InAdvance,
    code: discountCode,
    enabled: extensionPriceEnabled,
  });

  useBridgeCalculatedPriceToRedux(
    extensionPriceEnabled ? rentPriceQuery : boxGroupPriceQuery,
  );

  const defaultValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: user?.street || '',
    birthDate: user?.birthDate ? new Date(user?.birthDate) : undefined,
    city: user?.city || '',
    country: user?.country || '',
    postCode: user?.postCode || '',
    mailToSendInvoice: user?.email || '',
    phone: user?.phone || '',
    withBirthDate: !!tenant?.birthDateNecessary,
    withClientSource: !rentId && !!tenant?.clientSourceField,
    clientSource: '',
    nip: user?.companyData?.nip?.trim() || '',
    companyPostCode: user?.companyData.companyPostCode || '',
    companyCountry: user?.companyData.companyCountry || '',
    companyCity: user?.companyData.companyCity || '',
    companyStreet: user?.companyData.companyStreet || '',
    companyName: user?.companyData.companyName || '',
  };

  const methods = useForm<RentDataDto>({
    defaultValues,
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(new RentDataDto()),
  });
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const invoiceNeeded = watch('invoiceNeeded');

  useEffect(() => {
    const desc = rent?.description;
    const lastDescription =
      desc && desc.length > 0 ? desc[desc.length - 1] : undefined;
    if (lastDescription?.data?.isCompany) {
      setValue('invoiceNeeded', true);
    }
  }, [rent, setValue]);

  useEffect(() => {
    if (!user) return;
    if (!stock || (!rentId && (!stockId || !boxGroupId))) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
    }

  }, [user]);

  useEffect(() => {
    if (!user || !user.birthDate) return;

    dispatch(setBirthDate(new Date(user.birthDate)));
  }, [user]);

  useEffect(() => {
    if (!stock) return;

    if (isOpenEnded || rentPaymentType === RentPaymentType.Installments) {
      dispatch(setRentPaymentDocumentType(PaymentDocument.Invoice));
      return;
    }

    switch (stock.paymentDocumentConfig) {
      case StockPaymentDocument.Invoice: {
        dispatch(setRentPaymentDocumentType(PaymentDocument.Invoice));
        break;
      }
      case StockPaymentDocument.Receipt: {
        dispatch(setRentPaymentDocumentType(PaymentDocument.Receipt));
        break;
      }
      default: {
        dispatch(setRentPaymentDocumentType(PaymentDocument.Receipt));
        break;
      }
    }
  }, [stock, rentPaymentType, isOpenEnded]);

  const onSubmit = (data: RentDataDto) => {
    if (!user) return;
    const { withBirthDate: _withBirthDate, withClientSource: _withClientSource, ...rest } = data;
    dispatch(updateFormData({ ...rest, isCompany: invoiceNeeded }));
    history.push(
      `/${UserService.getSlugByRole(user.role)}/order/step/agreement/${rentId || ''}`,
    );
  };

  const onInvalid = (formErrors: FieldErrors<RentDataDto>) => {
    scrollToFirstFormError(formErrors, STEP_SUMMARY_FIELD_ORDER);
  };

  return (
    <Stack>
      {loadingPrice && <Spinner overlay halfTransparent />}

      <Section>
        {firstPeriodEnd && (
          <>
            <SummaryTable
              dateStart={startDate}
              dateEnd={firstPeriodEnd}
              countedPrice={calculatedPrice}
              addons={addons}
              orderAddons={orderAddons}
              isOpenEnded={isOpenEnded}
              periodDays={periodDays}
              invoiceDaysBefore={stock?.openEndedInvoiceDaysBefore || 7}
            />
            <Header variant="h2">{__('rent.discount')}</Header>
            <ControlledCheckbox
              checked={!!discount}
              name="discount"
              handleChange={(checked) => setDiscount(checked)}
              label={t('rent.i_have_a_discount')}
            />
          </>
        )}
      </Section>

      {discount && firstPeriodEnd ? (
        <DiscountForm
          stockId={stockId}
          boxGroupId={rent?.boxGroupId || boxGroupId}
          rentStart={startDate}
          rentEnd={firstPeriodEnd}
        />
      ) : null}

      <DiscountsList />

      <Form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <FormProvider {...methods}>
          <Stack>
            <Section>
              {tenant?.agreementDisclaimer ? (
                <Alert type="notice">
                  {textToSimpleMD(tenant.agreementDisclaimer)}
                </Alert>
              ) : null}
              <TenantDetailsForm disabled={!isFirstRent} />
            </Section>

            {stock && <PaymentDocumentType stock={stock} />}
            <Section>
              <Header variant="h2">
                {__('application.infoToOptionalInvoice')}
              </Header>

              <CheckBox
                {...register('invoiceNeeded')}
                label="application.wantOptionalInvoice"
                error={errors.invoiceNeeded?.message}
              />
            </Section>
            {invoiceNeeded && <CompanyDetailsForm disabled={!isFirstRent} />}
            {/* only new rents should see the input */}
            {!rentId && tenant?.clientSourceField ? <ClientSourceForm /> : null}
            <Section>
              <ButtonsContainer spaceBetween>
                <Button
                  size="large"
                  variant="secondary"
                  text="application.back"
                  iconLeft={<ArrowLeft />}
                  to={`/${UserService.getSlugByRole(user!.role)}/order/step/duration/${rentId || ''}`}
                />
                <Button
                  type="submit"
                  iconRight={<ArrowRight />}
                  size="large"
                  variant="primary"
                  text="application.goToOrder"
                />
              </ButtonsContainer>
            </Section>
          </Stack>
        </FormProvider>
      </Form>
    </Stack>
  );
};

export default StepSummary;
