import React from 'react';
import GoogleLogin from 'react-google-login';
import { __ } from '../../../../helpers/i18n';

import './GoogleButton.scss';

const GoogleButton = () => {
  const responseGoogle = (response: any) => {
    console.log(response);
  };

  return (
    <GoogleLogin
      clientId="615946111684-fif6ftu4rca6tjpbvhdh1r6eb8cqnt58.apps.googleusercontent.com"
      buttonText={`${__('application.continueWith')} Google`}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy="single_host_origin"
      className="google-button-custom"
    />
  );
};

export default GoogleButton;
