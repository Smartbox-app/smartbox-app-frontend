import React from 'react';
import { Button, LogoContainer, PageContent } from '../../../components/Branded';
import {
    ButtonsContainer,
    FormContainer,
    Section,
    SectionHeader,
} from '../../../components/Layout';
import { __ } from '../../../helpers/i18n';

const EmailSend = () => {
    return (
        <PageContent>
            <Section>
                <FormContainer>
                    <LogoContainer />
                    <SectionHeader title='application.thanksForRegister' />
                    <p className="">{__('application.toEndRegisterVerifyMail')}</p>
                    <p className="">{__('application.msgWasSentOnEmail')}</p>
                    <ButtonsContainer max>
                        {/*<Button*/}
                        {/*  primary*/}
                        {/*  text={__('application.reSendVerificationMail')}*/}
                        {/*  click={() => emailVerificationResendMail()}*/}
                        {/*/>*/}
                        <Button success text='application.backToApp' to="/" />
                    </ButtonsContainer>
                </FormContainer>
            </Section>
        </PageContent>
    );
};

export default EmailSend;
