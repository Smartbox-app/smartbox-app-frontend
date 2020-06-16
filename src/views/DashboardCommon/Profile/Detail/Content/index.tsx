import React from 'react';
import { connect } from 'react-redux';
import { UserRes } from 'smartbox-types';
import { ApplicationState } from '../../../../../reducers';

interface Props {
  user: UserRes;
}

const Content = ({ user }: Props) => (
  <div className="content-wrapper">
    <p>
      Imię: <strong>{user.firstName}</strong>
    </p>
    <p>
      Nazwisko: <strong>{user.lastName}</strong>
    </p>
    <p>
      E-mail: <strong>{user.email}</strong>
    </p>
    <p>
      Telefon: <strong>{user.phone}</strong>
    </p>
    <p>
      Rola: <strong>{user.role}</strong>
    </p>
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Content);
