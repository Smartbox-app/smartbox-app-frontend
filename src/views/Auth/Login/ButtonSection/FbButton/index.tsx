import React from 'react';
import FacebookLogin, { ReactFacebookFailureResponse, ReactFacebookLoginInfo } from 'react-facebook-login';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { auth } from '../../../../../actions';
import { __ } from '../../../../../helpers/i18n';

import './FbButton.scss';

interface Props {
  loginWithFacebook: (data: ReactFacebookLoginInfo) => void;
}

const FbButton = ({ loginWithFacebook }: Props) => {
  const responseFacebook = (data: ReactFacebookLoginInfo | ReactFacebookFailureResponse) => {
    if ((data as ReactFacebookLoginInfo).accessToken) {
      loginWithFacebook(data as ReactFacebookLoginInfo);
    }
  };

  return (
    <FacebookLogin
      appId="5213727608682643"
      fields="name,email"
      language="pl"
      cssClass="facebook-button-custom"
      callback={responseFacebook}
      icon="fa-facebook"
      textButton={`${__('application.continueWith')} Facebook`}
      isMobile={false}
      redirectUri="https://app.smartbox.dev2.itdotfocus.com/login"
    />
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...auth,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(FbButton);
