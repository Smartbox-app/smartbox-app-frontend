import React from 'react';
import { connect } from 'react-redux';
import { UserRes } from 'smartbox-types';
import { ApplicationState } from '../../../../../reducers';
import { __ } from '../../../../../helpers/i18n';
import { Row } from '../../../../../components/Common';

interface Props {
  user: UserRes;
}

const Content = ({ user }: Props) => (
  <div className="content-wrapper">
    <Row label={__('application.firstName')} content={user.firstName} />
    <Row label={__('application.lastName')} content={user.lastName} />
    <Row label={__('application.mail')} content={user.email} />
    <Row label={__('application.phone')} content={user.phone} />
    <Row label={__('application.userRole')} content={user.role} />
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Content);
