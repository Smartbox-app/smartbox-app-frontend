import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, ErrorBoundary } from '../../../components/Common';
import { LogoContainer, PageContent, ButtonsContainer, Section } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';

import Form from './Form';
import { modal } from '../../../actions';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

const Invoice = ({ showModal }: Props) => {
  return (
    <PageContent>
      <ErrorBoundary>
        <Section>
          <LogoContainer />
          <p>Dziękujemy za korzystanie z naszych usług.</p>
          <ButtonsContainer max>
            <Button success text="Przejdz do aplikacji" to="/" />
            <Button primary text="Wygeneruj fakturę" click={() => showModal(<Form orderId="asd" />)} />
          </ButtonsContainer>
        </Section>
      </ErrorBoundary>
    </PageContent>
  );
};

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Invoice);
