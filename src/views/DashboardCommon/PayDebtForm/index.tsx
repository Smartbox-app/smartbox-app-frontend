import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { differenceInCalendarDays } from 'date-fns';
import { bindActionCreators } from 'redux';
import { MyRentList, usePricing } from 'smartbox-types';
import { paymentStatus, singleRent } from '../../../actions';
import { Button, Spinner } from '../../../components/Common';
import { ButtonsContainer, FormContainer } from '../../../components/Layout';
import FormHeader from '../../../components/Layout/FormHeader';
import { ApplicationState } from '../../../reducers';
import AgreementWrapper from '../Order/Form/StepAgreement/AgreementWrapper';
import ScrollPosition from '../Order/Form/StepAgreement/ScrollPosition';
import SummaryTable from '../Order/Form/StepSummary/SummaryTable';
import UserService from '../../../services/user-service';
import { history } from '../../../App';
import { __ } from '../../../helpers/i18n';

interface RouteProps {
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  loading: boolean;
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
  singleRent: MyRentList;
  getSingleRent: (rentId: string) => void;
  getMyRentList: () => void;
  payNotPaidRentForm: (rentId: string) => void;
  resetPaymentForm: () => void;
  func: any;
}

const PayDebtForm = ({
  loading,
  isAgreementAccepted,
  isResignationMarked,
  singleRent,
  match,
  getMyRentList,
  getSingleRent,
  payNotPaidRentForm,
  resetPaymentForm,
  func,
}: Props) => {
  useEffect(() => {
    (async () => {
      await getMyRentList();
      await getSingleRent(match.params.rentId);
    })();
  }, []);

  const countPayPeriods = useCallback(
    (date: Date) => Math.ceil(differenceInCalendarDays(new Date(), new Date(date)) / 7),
    [],
  );
  const { pricing } = usePricing();

  const calc = useCallback((singleRent: MyRentList): number => {
    const { weekly } = pricing[singleRent.size || 3];
    return weekly * countPayPeriods(singleRent.finishAt);
  }, []);

  const submit = (data) => {
    payNotPaidRentForm(match.params.rentId);
  };
  const { handleSubmit } = useForm();

  //
  const onBack = () => {
    resetPaymentForm();
  };

  if (func) {
    return (
      <FormContainer>
        <div className="bank-input-wrapper">
          <div dangerouslySetInnerHTML={{ __html: func.payload || '' }} />
        </div>
        <ButtonsContainer max>
          <Button outline text={__('application.back')} click={() => onBack()} />
        </ButtonsContainer>
      </FormContainer>
    );
  }
  if (loading) return <Spinner overlay />;

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(submit)}>
        <FormHeader title="Opłacenie kary umownej:" />
        <SummaryTable dateStart={singleRent.finishAt} dateEnd={new Date()} countedPrice={calc(singleRent)} />
        <AgreementWrapper />
        <ScrollPosition />
        <ButtonsContainer max>
          <Button
            type="submit"
            primary
            text="Przejdź do płatności"
            disabled={!isAgreementAccepted || !isResignationMarked}
          />
        </ButtonsContainer>
      </form>
    </FormContainer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleRent: state.rent.singleRent,
  loading: state.spinner.loading,
  isAgreementAccepted: state.order.isAgreementAccepted,
  isResignationMarked: state.order.isResignationMarked,
  func: state.paymentStatus.func,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
      ...paymentStatus,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PayDebtForm));
