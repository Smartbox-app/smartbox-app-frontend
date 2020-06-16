import React from 'react';
import { connect } from 'react-redux';
import { UserRes } from 'smartbox-types';
import { ApplicationState } from '../../../../../reducers';

import Row from './Row';

interface Props {
  user: UserRes;
}

const Content = ({ user }: Props) => (
  <div className="content-wrapper">
    <Row label="Imię" content={user.firstName} />
    <Row label="Nazwisko" content={user.lastName} />
    <Row label="E-mail" content={user.email} />
    <Row label="Telefon" content={user.phone} />
    <Row label="Rola" content={user.role} />
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Content);
