import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { auth } from '../../../actions';
import { Spinner } from '../../../components/Branded';

interface RouteProps {
  googleToken: string;
}

interface Props extends RouteComponentProps<RouteProps> {
  authGmailUser: (googleToken: string) => void;
}

const GoogleAuth = ({ match, authGmailUser }: Props) => {
  useEffect(() => {
    authGmailUser(match.params.googleToken);
  }, []);
  return (
    <div>
      <Spinner />
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

export default withRouter(connect(null, mapDispatchToProps)(GoogleAuth));
