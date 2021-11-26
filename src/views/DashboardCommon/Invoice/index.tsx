import React from 'react';
import {Button} from '../../../components/Common';
import {LogoContainer, PageContent, ButtonsContainer, Section} from '../../../components/Layout';
import {__} from '../../../helpers/i18n';
import './Invoice.scss';

const Invoice = () => (
    <PageContent>
        <Section>
            <LogoContainer/>
            <p className="content-text">{__('application.paymentProcess')}</p>
            <p className="content-text">{__('application.thanks')}</p>
            <p className="content-text">{__('application.invoiceWasSent')}</p>
            <ButtonsContainer max>
                <Button success text={__('application.backToApp')} to="/"/>
            </ButtonsContainer>
        </Section>
    </PageContent>
)

export default Invoice;