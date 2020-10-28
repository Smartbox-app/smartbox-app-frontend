import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { Button } from '../../../components/Common';
import { LogoContainer, PageContent, ButtonsContainer, Section } from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { modal, singleRent } from '../../../actions';

import Form from './Form';

import './Invoice.scss';

interface RouteProps {
  paymentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  showModal: (content: React.ReactNode) => void;
  getMyRentList: () => void;
  fetchMyRentHistory: () => void;
}

const Invoice = ({ showModal, match, getMyRentList, fetchMyRentHistory }: Props) => {
  useEffect(() => {
    getMyRentList();
    fetchMyRentHistory();
  }, [])
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
      ...modal,
      ...singleRent,
    },
    dispatch,
  );

export default withRouter(connect(null, mapDispatchToProps)(Invoice));
