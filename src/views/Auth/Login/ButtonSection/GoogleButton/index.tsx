import React from 'react';
import { __ } from '../../../../../helpers/i18n';

import { Button } from '../../../../../components/Common';
import ApiService from '../../../../../services/api-service';

import './GoogleButton.scss';

const GoogleButton = () => {
  const logInHandle = () => {
    window.open(`${ApiService.url}auth/login-google`, '_self');
  };

  return (
    <>
      <Button
        text={`${__('application.continueWith')} Google`}
        click={() => logInHandle()}
        className="google-button-custom"
        icon="btn_google.svg"
        rounded
        outline
      />
    </>
  );
};

export default GoogleButton;
