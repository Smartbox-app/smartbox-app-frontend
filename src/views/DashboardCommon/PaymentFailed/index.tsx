import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from '../../../components/Common';
import { LogoContainer, PageContent, ButtonsContainer, Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { modal } from '../../../actions';

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
          Płatność zakończyła się <strong>niepowodzeniem</strong>.
        </p>
        <p className="content-text">Spróbuj ponownie</p>
        <ButtonsContainer max>
          <Button success text="Wróć do aplikacji" to="/" />
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
