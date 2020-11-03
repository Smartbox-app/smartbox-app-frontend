import React from 'react';

import { Button } from '../../components/Common';
import { ButtonsContainer, DashboardContainer, SectionHeader } from '../../components/Layout';
import { __ } from '../../helpers/i18n';

import './ApplicationError.scss';

const ApplicationError = () => (
  <DashboardContainer>
    <div className="application-error">
      <h1>{__('application.ApplicationError')}</h1>
      <SectionHeader title={__('application.404Text')} />
      <ButtonsContainer>
        <Button primary rounded to="/" text={__('application.backToHome')} />
      </ButtonsContainer>
    </div>
  </DashboardContainer>
);

export default ApplicationError;
