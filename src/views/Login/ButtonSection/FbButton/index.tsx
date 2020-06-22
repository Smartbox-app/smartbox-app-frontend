import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { AuthLoginResult } from 'smartbox-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { auth } from '../../../../actions';

import './FbButton.scss';

interface Props {
  loginWithFacebook: (data: any) => void;
}

const FbButton = ({ loginWithFacebook }: Props) => {
  const responseFacebook = (data: any) => {
    loginWithFacebook(data);
  };

  return (
    <FacebookLogin
      appId="3560212837341431"
      fields="name,email"
      language="pl"
      callback={responseFacebook}
      icon="fa-facebook"
      textButton="Zaloguj z FACEBOOK"
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
