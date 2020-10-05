import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, ErrorBoundary } from '../../../components/Common';
import { LogoContainer, PageContent, ButtonsContainer, Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { modal } from '../../../actions';

import Form from './Form';

import './Invoice.scss';

interface Props {
  paymentId: string;
  showModal: (content: React.ReactNode) => void;
}

const Invoice = ({ showModal }: Props) => {
  return (
    <PageContent>
      <ErrorBoundary>
        <Section>
          <LogoContainer />
          <p className="content-text">Płatność zakończyła się pozytywnie.</p>
          <p className="content-text">Dziękujemy za korzystanie z naszych usług.</p>
          <ButtonsContainer max>
            <Button success text="Wróć do aplikacji" to="/" />
            <Button primary text="Wygeneruj fakturę" click={() => showModal(<Form paymentId="paymentId" />)} />
          </ButtonsContainer>
        </Section>
      </ErrorBoundary>
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

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
