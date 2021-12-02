import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from '../../../components/Common';
import { LogoContainer, PageContent, ButtonsContainer, Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { modal } from '../../../actions';
import {__} from "../../../helpers/i18n";

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
        <ButtonsContainer max>
          <Button success text={__('application.backToApp')} to="/" />
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
