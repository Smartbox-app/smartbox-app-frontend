import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { UserRes, IPricingResult } from 'smartbox-types';
import { Button, CheckBox, Alert } from '../../../../../components/Common';
import { order, modal, notifications } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { MainPaymentWay } from '../../../../../reducers/order-reducer';
import { __ } from '../../../../../helpers/i18n';
import CompanyDetailsForm from './CompanyDetailsForm';

import Discount from './DiscountsList';
import PaymentMethods from './PaymentMethods';
import SummaryTable from './SummaryTable';

import './StepSummary.scss';
import TenantDetailsForm from './TenantDetailsForm';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  formData: FormType;
  countedPrice: IPricingResult;
  user: UserRes;
  selectedPaymentMethod: any;
  updateFormData: (data: any) => void;
  showModal: (content: React.ReactNode) => void;
  successNotification: (text: string) => void;
}

const StepSummary = ({
  formData,
  countedPrice,
  updateFormData,
  user,
  selectedPaymentMethod,
  match,
  showModal,
  successNotification,
}: Props) => {
  const [invoiceNeeded, setInvoiceNeeded] = useState(false);
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
  });

  const defaultValues = {
    paymentType: `${MainPaymentWay.card}`,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    street: user.street || '',
    city: user.city || '',
    postCode: user.postCode || '',
    mailToSendInvoice: user.email || '',
    phone: user.phone || '',

    nip: formData.nip || '',
    companyPostCode: formData.companyPostCode || '',
    companyCity: formData.companyCity || '',
    companyStreet: formData.companyStreet || '',
    companyName: formData.companyName || '',
  };

  const { handleSubmit, register, watch, control, errors } = useForm({ defaultValues });

  const onSubmit = (data: any) => {
    updateFormData(data);
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement/${match.params.rentId || ''}`);
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration/${match.params.rentId || ''}`);
  };

  const dataVerification = (): boolean => {
    if (typeof watch().paymentType !== 'string') {
      return true;
    } else if (Number(watch().paymentType) === MainPaymentWay.other && selectedPaymentMethod.id === '') {
      return true;
    } else if (Number(watch().paymentType) === MainPaymentWay.other && selectedPaymentMethod.id !== '') {
      return false;
    } else if (
      Number(watch().paymentType) === MainPaymentWay.blik ||
      Number(watch().paymentType) === MainPaymentWay.card
    ) {
      return false;
    } else {
      return true;
    }
  };

  const tenantData = (): boolean => {
    if (
      watch().firstName !== '' &&
      watch().lastName !== '' &&
      watch().street !== '' &&
      watch().city !== '' &&
      watch().postCode !== '' &&
      watch().mailToSendInvoice !== '' &&
      watch().phone !== ''
    ) {
      if (!errors.mailToSendInvoice && !errors.postCode) {
        return false;
      }
    }
    return true;
  };

  const companyData = (): boolean => {
    if (invoiceNeeded) {
      if (
        watch().companyName !== '' &&
        watch().companyStreet !== '' &&
        watch().companyCity !== '' &&
        watch().companyPostCode !== '' &&
        watch().nip !== ''
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const handleChange = (e: any) => {
    if (watch().paymentType !== `${MainPaymentWay.card}`) {
      if (countedPrice?.name === 'firstRentFreePracing') {
        successNotification(
          'Promocja 1zł za pierwszy tydzień obowiązuje tylko przy płatności kartą. Cena została zmieniona.',
        );
        updateFormData({
          isFirstRent: false,
        });
      }
    } else {
      updateFormData({
        isFirstRent: true,
      });
      successNotification('Promocja 1zł za pierwszy tydzień aktywna. Cena została zmieniona.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two" onChange={handleChange}>
      <Discount />
      <FormHeader title="Podsumowanie zamówienia:" />
      <SummaryTable dateStart={formData.dateStart} dateEnd={formData.dateEnd} countedPrice={countedPrice.value} />
      <PaymentMethods register={register} />
      <TenantDetailsForm register={register} control={control} errors={errors} />
      <p>Fakturę wystawimy na dane najemcy. Możesz też podać inne dane, na przykład Twojej firmy.</p>
      <CheckBox
        name="iNeedInvoice"
        checked={invoiceNeeded}
        handleChange={() => setInvoiceNeeded(!invoiceNeeded)}
        label="Chcę dodać inne dane lub potrzebuję faktury na firmę"
      />
      {invoiceNeeded && <CompanyDetailsForm register={register} errors={errors} control={control} />}
      <ButtonsContainer max>
        <Button outline text={__('application.back')} click={() => onBack()} />
        <Button
          type="submit"
          primary
          text="Przejdź do umowy"
          disabled={dataVerification() || tenantData() || companyData()}
        />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
  user: state.user.details,
  selectedPaymentMethod: state.order.selectedPaymentMethodDetail,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...modal,
      ...notifications,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSummary));
