import React from 'react';
import GoogleLogin from 'react-google-login';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { __ } from '../../../../helpers/i18n';
import { auth } from '../../../../actions';

import './GoogleButton.scss';
import { Button } from '../../../../components/Common';

interface Props {
  loginWithGoogle: () => void;
}

const GoogleButton = ({ loginWithGoogle }: Props) => {
  const responseGoogle = (response: any) => {
    console.log(response);
    // loginWithGoogle();
  };

  return (
    <>
      <GoogleLogin
        clientId="615946111684-fif6ftu4rca6tjpbvhdh1r6eb8cqnt58.apps.googleusercontent.com"
        buttonText={`${__('application.continueWith')} Google`}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy="single_host_origin"
        redirectUri="/test"
        className="google-button-custom"
      />
      <Button text="test" primary click={() => loginWithGoogle()} />
    </>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...auth,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(GoogleButton);
