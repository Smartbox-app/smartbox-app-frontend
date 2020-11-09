import React from 'react';
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

const EmailSend = () => {
  return (
    <PageContent>
      <Section>
        <FormContainer>
          <LogoContainer />
          <SectionHeader title="Dziękujemy za rejestrację" />
          <p className="">Aby dokończyć rejestrację proszę zweryfikować maila.</p>
          <p className="">Wiadomość została wysłana na podany address mail.</p>
          <ButtonsContainer max>
            <Button success text={__('application.backToApp')} to="/" />
          </ButtonsContainer>
        </FormContainer>
      </Section>
    </PageContent>
  );
};

export default EmailSend;
