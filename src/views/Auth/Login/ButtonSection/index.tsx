import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import FbButton from './FbButton';
import GoogleButton from './GoogleButton';
import { __ } from '../../../../helpers/i18n';

import './ButtonSection.scss';

const ButtonsSection = () => (
  <div className="login-buttons-section">
    <ButtonsContainer max column>
      <Button text={__('application.login')} big type="submit" primary rounded />
      <FbButton />
      <GoogleButton />
      <Button text={__('application.register')} big to="/register" outline rounded />
    </ButtonsContainer>
    <p className="lost-pass">
      {__('application.forgotPass')}{' '}
      <Link className="light" to="/restore-pass">
        {__('application.clickHere')}
      </Link>
    </p>
  </div>
);

export default ButtonsSection;
