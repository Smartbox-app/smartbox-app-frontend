import React from 'react';
import GoogleLogin from 'react-google-login';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { __ } from '../../../../helpers/i18n';
import { auth, modal } from '../../../../actions';

import { Button } from '../../../../components/Common';
import ApiService from '../../../../services/api-service';

import './GoogleButton.scss';

interface Props {
  loginWithGoogle: () => void;
  showModal: (data: any) => void;
  getUserLoginGoogleData: () => void;
}

const GoogleButton = ({ loginWithGoogle, showModal, getUserLoginGoogleData }: Props) => {
  const responseFailedGoogle = (response: any) => {
    console.log('responseFailedGoogle', response);
    // loginWithGoogle();
  };
  const responseSuccessGoogle = (response: any) => {
    console.log('responseSuccessGoogle', response);
    // loginWithGoogle();
  };

  const logInHandle = async (e: any) => {
    const openedWindow = window.open(
      `${ApiService.url}auth/login-google`,
      'Logowanie - Konta Google',
      'height=700,width=600',
    );

    console.log('openedWindow', openedWindow);
  };

  return (
    <>
      <Button text="test" primary click={(event: any) => logInHandle(event)} />
      <GoogleLogin
        clientId="615946111684-fif6ftu4rca6tjpbvhdh1r6eb8cqnt58.apps.googleusercontent.com"
        buttonText={`${__('application.continueWith')} Google`}
        onSuccess={responseSuccessGoogle}
        onFailure={responseFailedGoogle}
        cookiePolicy="single_host_origin"
        className="google-button-custom"
      />
    </>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...auth,
      ...modal,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(GoogleButton);
