import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { Button } from '../../../components/Common';
import { LogoContainer, PageContent, ButtonsContainer, Section } from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { ApplicationState } from '../../../reducers';
import { modal } from '../../../actions';

import Form from './Form';

import './Invoice.scss';

interface RouteProps {
  rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  paymentId: string;
  showModal: (content: React.ReactNode) => void;
}

const Invoice = ({ showModal, paymentId, match }: Props) => {
  return (
    <PageContent>
      <Section>
        <LogoContainer />
        <p className="content-text">{__('application.paymentSuccess')}.</p>
        <p className="content-text">{__('application.thanks')}</p>
        <ButtonsContainer max>
          <Button success text={__('application.backToApp')} to="/" />
          <Button
            primary
            text={__('application.generateInvoice')}
            click={() => showModal(<Form paymentId={match.params.rentId} />)}
          />
        </ButtonsContainer>
      </Section>
    </PageContent>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  paymentId: state.order.paymentId,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Invoice));
