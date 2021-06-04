import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { UserRes, IPricingResult, PaymentType } from 'smartbox-types';
import { Button, CheckBox } from '../../../../../components/Common';
import { order, modal, notifications, user } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { __ } from '../../../../../helpers/i18n';
import CompanyDetailsForm from './CompanyDetailsForm';

import Discount from './DiscountsList';
import PaymentMethods from './PaymentMethods';
import SummaryTable from './SummaryTable';
import TenantDetailsForm from './TenantDetailsForm';

import './StepSummary.scss';

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
  fetchMyData: () => void;
  showModal: (content: React.ReactNode) => void;
  successNotification: (text: string) => void;
}

const StepSummary = ({
  formData,
  countedPrice,
  fetchMyData,
  updateFormData,
  user,
  selectedPaymentMethod,
  match,
  showModal,
  successNotification,
}: Props) => {
  const [invoiceNeeded, setInvoiceNeeded] = useState(false);
  useEffect(() => {
    fetchMyData();
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
    if (formData.nip) {
      setInvoiceNeeded(true);
    }
  }, []);

  const defaultValues = {
    paymentType: `${PaymentType.card}`,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    street: user.street || '',
    city: user.city || '',
    postCode: user.postCode || '',
    mailToSendInvoice: user.email || '',
    phone: user.phone || '',

    nip: user.companyData.nip || '',
    companyPostCode: user.companyData.postCode || '',
    companyCity: user.companyData.city || '',
    companyStreet: user.companyData.street || '',
    companyName: user.companyData.name || '',
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
    } else if (Number(watch().paymentType) === PaymentType.transfer && selectedPaymentMethod.id === '') {
      return false; // TODO fix to work with tpay
    } else if (Number(watch().paymentType) === PaymentType.transfer && selectedPaymentMethod.id !== '') {
      return false;
    } else if (Number(watch().paymentType) === PaymentType.blik || Number(watch().paymentType) === PaymentType.card) {
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

  const paymentChangeOnly = (e: any): boolean => {
    switch (e.target.id) {
      case 'paymentTypeBlik': {
        return true;
      }
      case 'paymentTypeCard': {
        return true;
      }
      case 'paymentTypeBank': {
        return true;
      }
      default:
        return false;
    }
  };

  const handleChange = (e: any) => {
    if (user.rentCount === 0) {
      if (paymentChangeOnly(e)) {
        if (watch().paymentType !== `${PaymentType.card}`) {
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
      }
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
      ...user,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSummary));
