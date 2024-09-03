import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect, useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { differenceInCalendarDays, differenceInDays } from 'date-fns';
import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { paymentStatus, singleRent } from '../../../actions';
import { Button, Spinner } from '../../../components/Branded';
import { ButtonsContainer, FormContainer } from '../../../components/Layout';
import FormHeader from '../../../components/Layout/FormHeader';
import { ApplicationState } from '../../../reducers';
import ScrollPosition from '../Order/Form/StepAgreement/ScrollPosition';
import SummaryTable from '../Order/Form/StepSummary/SummaryTable';
import './PayDebtForm.scss';
import ApiService from '../../../services/api-service';

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

// @TODO handle
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

  const tenant = useSelector((state: ApplicationState) => state.tenant);

  const countPayPeriods = useCallback(
    (date: Date) => Math.ceil(differenceInCalendarDays(new Date(), new Date(date)) / 7),
    [],
  );
  // const { pricing } = usePricing();

  // const calc = useCallback((singleRent: MyRentList): number => {
  //   const { weekly } = pricing[singleRent.size || 3];
  //   return weekly * countPayPeriods(singleRent.finishAt);
  // }, []);

  const calc = (singleRent: MyRentList) => {
    return 0;
    // const fullWeeks = Math.ceil(differenceInDays(new Date(), new Date(singleRent.finishAt)) / 7);
    // const cost = Math.max(1, Math.min(2, fullWeeks)) * pricing[singleRent.size || 3].weekly; // 100 - 200 PLN
    // return cost;
  };

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
        <div className="payment-wrapper">
          <div className="bank-input-wrapper">
            <div dangerouslySetInnerHTML={{ __html: func.payload || '' }} />
          </div>
          <ButtonsContainer max>
            <Button outline text="application.back" click={() => onBack()} />
          </ButtonsContainer>
        </div>
      </FormContainer>
    );
  }
  if (loading) return <Spinner overlay />;
  if(!tenant) return null;
  const desktop = window.matchMedia('(min-width: 920px)').matches;
  return (
    <FormContainer>
      <form onSubmit={handleSubmit(submit)}>
        <FormHeader title="application.penaltyPayment" />
        {/* <SummaryTable dateStart={singleRent.finishAt} dateEnd={new Date()} countedPrice={calc(singleRent)} /> */}
        {desktop && (
          <object
            className="rules-embed"
            data={`${ApiService.url}tenant/agreement/${tenant.id}#toolbar=0&navpanes=0&scrollbar=0`}
            type="application/pdf"
          />
        )}
        <Button primary blank to={`${ApiService.url}tenant/agreement/${tenant.id}`} text='Kliknij aby otworzyć regulamin' />

        <span className="separator" />
        <ScrollPosition />

        <ButtonsContainer max>
          <Button type="submit" primary text="application.goToPayment" disabled={!isResignationMarked} />
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
