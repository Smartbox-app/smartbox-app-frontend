import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { auth } from '../../../actions';
import { Button } from '../../../components/Common';
import {
  ButtonsContainer,
  FormContainer,
  PageContent,
  Section,
  SectionHeader,
  LogoContainer,
} from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';
import { ApplicationState } from '../../../reducers';

interface Props {
  emailVerificationResendMail: () => void;
}

const EmailSend = ({ emailVerificationResendMail }: Props) => {
  return (
    <PageContent>
      <Section>
        <FormContainer>
          <LogoContainer />
          <SectionHeader title="Dziękujemy za rejestrację" />
          <p className="">Aby dokończyć rejestrację proszę zweryfikować maila.</p>
          <p className="">Wiadomość została wysłana na podany address mail.</p>
          <ButtonsContainer max>
            {/*<Button*/}
            {/*  primary*/}
            {/*  text={__('application.reSendVerificationMail')}*/}
            {/*  click={() => emailVerificationResendMail()}*/}
            {/*/>*/}
            <Button success text={__('application.backToApp')} to="/" />
          </ButtonsContainer>
        </FormContainer>
      </Section>
    </PageContent>
  );
};

const mapStateToProps = (state: ApplicationState) => ({});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...auth,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailSend));
