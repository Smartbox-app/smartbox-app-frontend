import React from 'react';
import GoogleLogin from 'react-google-login';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { __ } from '../../../../helpers/i18n';
import { auth, modal } from '../../../../actions';

import './GoogleButton.scss';
import { Button } from '../../../../components/Common';
import ApiService from '../../../../services/api-service';

interface Props {
  loginWithGoogle: () => void;
  logoutGoogle: () => void;
  showModal: (data: any) => void;
}

const GoogleButton = ({ loginWithGoogle, logoutGoogle, showModal }: Props) => {
  const responseGoogle = (response: any) => {
    console.log(response);
    // loginWithGoogle();
  };

  const logInHandle = async (e: any) => {
    const openedWindow = window.open(
      `${ApiService.url}auth/login-google`,
      'Logowanie - Konta Google',
      'height=700,width=600',
    );
    console.log('event', e);
    // console.log('openedWindow', openedWindow);

    // // setTimeout(() => {
    // //   openedWindow?.close();
    // // }, 3000);
  };

  return (
    <>
      {/* <GoogleLogin
        clientId="615946111684-fif6ftu4rca6tjpbvhdh1r6eb8cqnt58.apps.googleusercontent.com"
        buttonText={`${__('application.continueWith')} Google`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy="single_host_origin"
        redirectUri="/test"
        className="google-button-custom"
      /> */}
      <Button text="test" primary click={(event: any) => logInHandle(event)} />
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
