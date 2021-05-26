import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { paymentStatus, singleRent } from '../../../actions';
import { payNotPaidRentForm } from '../../../actions/payment-status';
import { Button, Spinner } from '../../../components/Common';
import { ButtonsContainer, FormContainer } from '../../../components/Layout';
import FormHeader from '../../../components/Layout/FormHeader';
import { __ } from '../../../helpers/i18n';
import { ApplicationState } from '../../../reducers';
import AgreementWrapper from '../Order/Form/StepAgreement/AgreementWrapper';
import ScrollPosition from '../Order/Form/StepAgreement/ScrollPosition';
import SummaryTable from '../Order/Form/StepSummary/SummaryTable';

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
  func,
}: Props) => {
  useEffect(() => {
    (async function() {
      await getMyRentList();
      await getSingleRent(match.params.rentId);
    })();
  }, []);

  const submit = (data) => {
    payNotPaidRentForm(match.params.rentId);
    console.log('match', match.params.rentId);
    console.log('data', data);
  };
  const { handleSubmit } = useForm();

  if (func)
    return (
      <FormContainer>
        <div className="bank-input-wrapper">
          <div dangerouslySetInnerHTML={{ __html: func.payload || '' }} />
        </div>
      </FormContainer>
    );
  if (loading) return <Spinner overlay />;

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(submit)}>
        <FormHeader title="Opłacenie kary umownej:" />
        <SummaryTable dateStart={singleRent.finishAt} dateEnd={new Date()} countedPrice={200} />
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
