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
import UserData from '../../../../../components/Common/UserData';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  formData: FormType;
  countedPrice: IPricingResult;
  user: UserRes;
  selectedPaymentMethod: any;
  selectedPayment: PaymentType;
  updateFormData: (data: Partial<FormType>) => void;
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
  selectedPayment,
  match,
  showModal,
  successNotification,
}: Props) => {
  const [invoiceNeeded, setInvoiceNeeded] = useState(false);
  const isFirstRent = !user.rentCount;

  useEffect(() => {
    fetchMyData();
    if (!formData.size) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
    }
    if (formData.nip) {
      setInvoiceNeeded(true);
    }

    if (!isFirstRent) {
      if (user.companyData && user.companyData.nip) {
        setInvoiceNeeded(true);
      } else {
        setInvoiceNeeded(false);
      }
    }
  }, []);

  const defaultValues = {
    paymentType: `${selectedPayment || PaymentType.card}`,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    street: user.street || '',
    city: user.city || '',
    postCode: user.postCode || '',
    mailToSendInvoice: user.email || '',
    phone: user.phone || '',

    nip: user.companyData.nip || '',
    companyPostCode: user.companyData.companyPostCode || '',
    companyCity: user.companyData.companyCity || '',
    companyStreet: user.companyData.companyStreet || '',
    companyName: user.companyData.companyName || '',
  };

  const { handleSubmit, register, watch, control, errors } = useForm({ defaultValues });

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

  const onSubmit = (data: any) => {
    updateFormData({ ...data, isCompany: invoiceNeeded });
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement/${match.params.rentId || ''}`);
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
    if (isFirstRent) {
      if (paymentChangeOnly(e)) {
        if (Number(watch().paymentType) !== PaymentType.card) {
          if (countedPrice?.name === 'firstRentFreePricing') {
            successNotification('notification.firstWeekForOneOnlyCard');
            updateFormData({
              isFirstRent: false,
            });
          }
        } else {
          updateFormData({
            isFirstRent: true,
          });
          successNotification('notification.firstWeekForOneActive');
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two" onChange={handleChange}>
      <Discount />
      <FormHeader title="application.orderSummary" />
      <SummaryTable dateStart={formData.dateStart} dateEnd={formData.dateEnd} countedPrice={countedPrice.value} />
      {countedPrice.value > 0 && <PaymentMethods register={register} />}

      <TenantDetailsForm register={register} control={control} errors={errors} disabled={!isFirstRent} />
      {isFirstRent && (
        <>
          <p>{__('application.infoToOptionalInvoice')}</p>
          <CheckBox
            name="iNeedInvoice"
            checked={invoiceNeeded}
            handleChange={() => setInvoiceNeeded(!invoiceNeeded)}
            label="application.wantOptionalInvoice"
          />
        </>
      )}
      {invoiceNeeded && (
        <CompanyDetailsForm register={register} errors={errors} control={control} disabled={!isFirstRent} />
      )}

      <ButtonsContainer max>
        <Button outline text="application.back" click={() => onBack()} />
        <Button
          type="submit"
          primary
          text="application.goToOrder"
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
  selectedPayment: state.order.selectedPayment,
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
