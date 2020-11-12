import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RentBoxReq, UserRole, IPricingResult, UserRes, StockList, ExtendRentalReq } from 'smartbox-types';
import { Alert, Button } from '../../../../../components/Common';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';

import AgreementWrapper from './AgreementWrapper';
import ScrollPosition from './ScrollPosition';
import { ApplicationState } from '../../../../../reducers';
import { __ } from '../../../../../helpers/i18n';

import './StepAgreement.scss';

interface RouteProps {
  step: string;
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  formData: FormType;
  countedPrice: IPricingResult;
  user: UserRes;
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
  stock: StockList;
  sentExtendRentRequest: (rentId: string, data: ExtendRentalReq, role: UserRole) => void;
  sentRentBoxRequest: (data: RentBoxReq, nextStep: string, role: UserRole) => void;
}

const StepSummary = ({
  formData,
  user,
  isAgreementAccepted,
  isResignationMarked,
  sentRentBoxRequest,
  countedPrice,
  stock,
  match,
  sentExtendRentRequest,
}: Props): any => {
  useEffect(() => {
    if (formData.size.length === 0) {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/size`);
    }
  });

  const { handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    const dataCollectionExtendRent: ExtendRentalReq = {
      finishAt: formData.dateEnd,
      cost: countedPrice.value,
      discountCode: formData.discountCode,
      firstName: formData.firstName,
      lastName: formData.lastName,
      street: formData.street,
      city: formData.city,
      postCode: formData.postCode,
      isCompany: formData.isCompany || false,
      phone: formData.phone,
      mailToSendInvoice: formData.mailToSendInvoice,
      companyName: formData.companyName || '',
      companyStreet: formData.companyStreet || '',
      companyCity: formData.companyCity || '',
      companyPostCode: formData.companyPostCode || '',
      nip: formData.nip || '',
      isPaySavedCard: false,
    };
    const dataCollectionRent: RentBoxReq = {
      startAt: formData.dateStart,
      stockId: stock.id,
      size: Number(formData.size),
      companyName: formData.companyName || '',
      companyStreet: formData.companyStreet || '',
      companyCity: formData.companyCity || '',
      companyPostCode: formData.companyPostCode || '',
      nip: formData.nip || '',
      ...dataCollectionExtendRent,
    };

    if (match.params.rentId) {
      // rent extension
      sentExtendRentRequest(match.params.rentId, dataCollectionExtendRent, user.role);
    } else {
      // new Rent blik/creditcart
      sentRentBoxRequest(dataCollectionRent, 'payment', user.role);
    }
  };

  const onBack = () => {
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/summary/${match.params.rentId || ''}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader title={__('application.orderAgreement')} />
      <AgreementWrapper />
      <ScrollPosition />
      <Alert type="notice" text={__('application.orderAgreementAcceptation')} />
      <ButtonsContainer max>
        <Button outline text={__('application.back')} click={() => onBack()} />
        <Button
          type="submit"
          primary
          text="Przejdź do płatności"
          disabled={!isAgreementAccepted || !isResignationMarked}
        />
      </ButtonsContainer>
    </form>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  formData: state.order.formData,
  countedPrice: state.order.countedPrice,
  user: state.user.details,
  isAgreementAccepted: state.order.isAgreementAccepted,
  isResignationMarked: state.order.isResignationMarked,
  stock: state.stock.list[0],
  rentId: state.rent.singleRent.id,
  selectedPaymentMethodDetailId: state.order.selectedPaymentMethodDetail.id,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSummary));
