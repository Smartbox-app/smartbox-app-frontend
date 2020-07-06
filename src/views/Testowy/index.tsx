import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { auth, modal } from '../../actions';

interface RouteProps {
  userId: string;
  updateToken: string;
  code: any;
}

interface Props extends RouteComponentProps<any> {
  logoutGoogle: () => void;
}

const Testowy = ({ match, logoutGoogle }: Props) => {
  useEffect(() => {
    // logoutGoogle();
  }, []);
  console.log('match', match);
  return <div>Testowy</div>;
};
// TODO: usunąć
const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...auth,
      ...modal,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Testowy);
