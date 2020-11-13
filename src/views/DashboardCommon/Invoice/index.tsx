import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { Button } from '../../../components/Common';
import { LogoContainer, PageContent, ButtonsContainer, Section } from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { order } from '../../../actions';

import './Invoice.scss';

interface RouteProps {
  paymentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  checkIfStockIsRented: (paymentId: string) => void;
}

const Invoice = ({ checkIfStockIsRented, match }: Props) => {
  useEffect(() => {
    checkIfStockIsRented(match.params.paymentId);
    // getMyRentList();
    // fetchMyRentHistory();
    // fetchMyData();
  }, []);
  return (
    <PageContent>
      <Section>
        <LogoContainer />
        <p className="content-text">{__('application.paymentSuccess')}</p>
        <p className="content-text">{__('application.thanks')}</p>
        <p className="content-text">{__('application.invoiceWasSent')}</p>
        <ButtonsContainer max>
          <Button success text={__('application.backToApp')} to="/" />
        </ButtonsContainer>
      </Section>
    </PageContent>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
    },
    dispatch,
  );

export default withRouter(connect(null, mapDispatchToProps)(Invoice));
