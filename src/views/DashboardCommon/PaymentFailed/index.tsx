import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, LogoContainer, PageContent } from '../../../components/Branded';
import { ButtonsContainer, Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { modal } from '../../../actions';
import {__} from "../../../helpers/i18n";

import './PaymentFailed.scss';

interface Props {
  paymentId: string;
  showModal: (content: React.ReactNode) => void;
}

const PaymentFailed = ({ showModal, paymentId }: Props) => {
  return (
    <PageContent>
      <Section>
        <LogoContainer />
        <p className="content-text">
            {__('application.paymentFinished')}{' '}<strong>{__('application.withFailure')}</strong>.
        </p>
        <ButtonsContainer className='failure-button-container'>
          <Button success text='application.backToApp' to="/" />
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentFailed);
