import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { MyRentDetails, PaymentType } from 'smartbox-types';
import { Spinner } from '../../../../../components/Branded';
import { order, modal, notifications, user } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import {
  Alert,
  CheckBox as ControlledCheckbox,
} from '../../../../../components/Common';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';

import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { __ } from '../../../../../helpers/i18n';
import { CompanyDetailsForm } from './CompanyDetailsForm';

import { DiscountsList } from './DiscountsList';
import SummaryTable from './SummaryTable';
import TenantDetailsForm from './TenantDetailsForm';

import {
  calculatePrice,
  calculatePriceForRent,
  setBirthDate,
} from '../../../../../actions/order';
import { useTenant } from '../../../../../hooks/useTenant';
import { useGetMyDetailsQuery } from 'src/queries';
import { RentDataDto } from './TenantDetailsForm/dto/RentDataDto';
import {
  CheckBox,
  Button,
  Section,
  Header,
  Stack,
  Form,
} from 'src/components/ui';
import { ClassValidatorResolver } from 'src/resolvers/ClassValidatorResolver';
import { DiscountForm } from './DiscountForm';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { textToSimpleMD } from 'src/utils/text-to-simple-md';
import { ClientSourceForm } from './ClientSourceForm';
import ApiService from 'src/services/api-service';

interface Props {
  formData: FormType;
  updateFormData: (data: Partial<FormType>) => void;
  showModal: (content: React.ReactNode) => void;
  successNotification: (text: string) => void;
}

const StepSummary = ({ formData, updateFormData }: Props) => {
  const { tenant } = useTenant();

  const dispatch = useDispatch();
  const {
    calculatedPrice,
    addons,
    orderAddons,
    loadingPrice,
    discountCode,
    stockId,
    boxGroupId,
    startDate,
    endDate,
  } = useSelector((state: ApplicationState) => state.order);

  const { data: user } = useGetMyDetailsQuery();
  const { rentId } = useParams<{ step: string; rentId: string }>();
  const isFirstRent = user && !user.rentCount;
  const [discount, setDiscount] = useState<boolean>(false);
  const [rent, setRent] = useState<MyRentDetails>();
  const [loading, setLoading] = useState<boolean>(false);

  const defaultValues = {
    paymentType: PaymentType.card,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: user?.street || '',
    birthDate: user?.birthDate ? new Date(user?.birthDate) : undefined,
    city: user?.city || '',
    postCode: user?.postCode || '',
    mailToSendInvoice: user?.email || '',
    phone: user?.phone || '',

    clientSource: '',
    nip: user?.companyData.nip || '',
    companyPostCode: user?.companyData.companyPostCode || '',
    companyCity: user?.companyData.companyCity || '',
    companyStreet: user?.companyData.companyStreet || '',
    companyName: user?.companyData.companyName || '',
  };

  const methods = useForm<RentDataDto>({
    defaultValues,
    mode: 'onSubmit',
    resolver: ClassValidatorResolver(
      new RentDataDto(!!tenant?.birthDateNecessary),
    ),
  });
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors, isValid },
  } = methods;

  const invoiceNeeded = watch('invoiceNeeded');

  // get rent details if it is extended
  // @TODO - move to react query
  const getSingleRent = async () => {
    setLoading(true);
    await ApiService.callFetch(
      'GET',
      `rent/my-details/${rentId}`,
      (data: MyRentDetails) => {
        setRent(data);
      },
    );
    setLoading(false);
  };

  useEffect(() => {
    if (!rentId) return;

    getSingleRent();
  }, [rentId]);

  useEffect(() => {
    const lastDescription = rent?.description[rent.description.length - 1];
    if (lastDescription?.data?.isCompany) {
      setValue('invoiceNeeded', true);
    }
  }, [rent]);

  useEffect(() => {
    if (!user) return;
    if (!rentId && (!stockId || !boxGroupId)) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
    }

    if (!endDate) return;

    if (rentId) {
      dispatch(calculatePriceForRent(rentId, startDate, endDate));
    } else {
      dispatch(calculatePrice(boxGroupId, startDate, endDate));
    }
  }, [user]);

  useEffect(() => {
    if (!user || !user.birthDate) return;

    dispatch(setBirthDate(new Date(user.birthDate)));
  }, [user]);

  useEffect(() => {
    if (!endDate) return;

    if (rentId) {
      dispatch(calculatePriceForRent(rentId, startDate, endDate, discountCode));
    } else {
      dispatch(calculatePrice(boxGroupId, startDate, endDate, discountCode));
    }
  }, [discountCode]);

  const onSubmit = (data: RentDataDto) => {
    if (!isValid) return;
    if (!user) return;
    updateFormData({ ...data, isCompany: invoiceNeeded });
    history.push(
      `/${UserService.getSlugByRole(user.role)}/order/step/agreement/${rentId || ''}`,
    );
  };

  return (
    <Stack>
      {loadingPrice && <Spinner overlay halfTransparent />}

      <Section>
        {endDate && (
          <>
            <SummaryTable
              dateStart={startDate}
              dateEnd={endDate}
              countedPrice={calculatedPrice}
              addons={addons}
              orderAddons={orderAddons}
            />
            <Header variant="h2">{__('rent.discount')}</Header>
            <ControlledCheckbox
              checked={!!discount}
              name="discount"
              handleChange={(checked) => setDiscount(checked)}
              label="rent.i_have_a_discount"
            />
          </>
        )}
      </Section>

      {discount && endDate ? (
        <DiscountForm
          stockId={stockId}
          boxGroupId={boxGroupId}
          rentStart={startDate}
          rentEnd={endDate}
        />
      ) : null}

      <DiscountsList />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormProvider {...methods}>
          <Stack>
            <Section>
              {tenant?.agreementDisclaimer ? (
                <Alert type="notice">
                  {textToSimpleMD(tenant.agreementDisclaimer)}
                </Alert>
              ) : null}
              <TenantDetailsForm disabled={!isFirstRent} />

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

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...modal,
      ...notifications,
      ...user,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(StepSummary);
