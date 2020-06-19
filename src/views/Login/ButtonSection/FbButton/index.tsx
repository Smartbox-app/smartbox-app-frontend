import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { AuthLoginResult } from 'smartbox-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { auth } from '../../../../actions';

interface Props {
  loginWithFacebook: (data: any) => void;
}

const FbButton = ({ loginWithFacebook }: Props) => {
  const componentClicked = (data: any) => {
    console.log('componentClicked', data);
  };
  const responseFacebook = (data: any) => {
    console.log('responseFacebook', data);
    loginWithFacebook(data);
  };
  return (
    <div>
      <FacebookLogin
        appId="3131638240283290"
        // autoLoad
        fields="name,email"
        onClick={componentClicked}
        callback={responseFacebook}
      />
    </div>
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
