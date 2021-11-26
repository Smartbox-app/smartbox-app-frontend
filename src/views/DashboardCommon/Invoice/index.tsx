import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { Button, Spinner } from '../../../components/Common';
import { LogoContainer, PageContent, ButtonsContainer, Section, SimpleHeader } from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { order, singleRent, user } from '../../../actions';

import './Invoice.scss';
import { ApplicationState } from '../../../reducers';

interface RouteProps {
  paymentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  isPaid: boolean;
  checkIfStockIsRented: (paymentId: string) => void;
  getMyRentList: () => void;
  fetchMyRentHistory: () => void;
  fetchMyData: () => void;
}

const Invoice = ({ isPaid, getMyRentList, fetchMyRentHistory, fetchMyData, checkIfStockIsRented, match }: Props) => {
  // useEffect(() => {
  //   if (!match.params.paymentId) {
  //   } else {
  //     const timer = setInterval(() => {
  //       checkIfStockIsRented(match.params.paymentId);
  //     }, 3000);
  //     return () => {
  //       clearInterval(timer);
  //     };
  //   }
  // }, [isPaid]);
  return (
    <PageContent>
      <Section>
        <LogoContainer />
        {/*{match.params.paymentId ? (*/}
        {false ? (
          <>
            <Spinner />
            <p className="content-text">Trwa przetwarzanie płatności</p>
          </>
        ) : (
          <>
            <p className="content-text">{__('application.paymentProcess')}</p>
            <p className="content-text">{__('application.thanks')}</p>
            <p className="content-text">{__('application.invoiceWasSent')}</p>
            <ButtonsContainer max>
              <Button success text={__('application.backToApp')} to="/" />
            </ButtonsContainer>
          </>
        )}
      </Section>
    </PageContent>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  isPaid: state.paymentStatus.isPaid,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...singleRent,
      ...user,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Invoice));
