import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { UserRes, IPricingResult } from 'smartbox-types';
import { Button, CheckBox } from '../../../../../components/Common';
import { order } from '../../../../../actions';
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
}

const StepSummary = ({ formData, countedPrice, updateFormData, user, selectedPaymentMethod, match }: Props) => {
  const [invoiceNeeded, setInvoiceNeeded] = useState(false);
  useEffect(() => {
    if (formData.size.length === 0) {
      // history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
  });

  const defaultValues = {
    paymentType: `${MainPaymentWay.card}`,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-step-two">
      {console.log('watch()', watch())}
      <Discount />
      <FormHeader title="Podsumowanie zamówienia:" />
      <SummaryTable dateStart={formData.dateStart} dateEnd={formData.dateEnd} countedPrice={countedPrice.value} />
      <PaymentMethods register={register} />
      <TenantDetailsForm register={register} control={control} errors={errors} />
      <p>Fakturę wystawimy na dane odbiorcy. Możesz też podać inne dane, na przykład Twojej firmy.</p>
      <CheckBox
        name="iNeedInvoice"
        checked={invoiceNeeded}
        handleChange={() => setInvoiceNeeded(!invoiceNeeded)}
        label="Chcę dodać inne dane lub potrzebuję faktury na firmę"
      />
      {invoiceNeeded && <CompanyDetailsForm register={register} errors={errors} control={control} />}
      <ButtonsContainer max>
        <Button outline text={__('application.back')} click={() => onBack()} />
        <Button type="submit" primary text="Przejdź do umowy" disabled={dataVerification()} />
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
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSummary));
