import React from 'react';

import { Button } from '../../components/Common';
import { ButtonsContainer } from '../../components/Layout';
import { __ } from '../../helpers/i18n';

import './Page404.scss';

const Page404 = () => (
  <div className="page-not-found">
    <h1>404</h1>
    <h2>{__('application.404Text')}</h2>
    <ButtonsContainer>
      <Button to="/" text={__('application.backToHome')} />
    </ButtonsContainer>
  </div>
);

export default Page404;
