import React from 'react';
import { connect } from 'react-redux';
import { UserRes } from 'smartbox-types';
import { SimpleHeader } from '../../../../../components/Layout';
import { ApplicationState } from '../../../../../reducers';
import { __ } from '../../../../../helpers/i18n';
import { Row } from '../../../../../components/Common';

import './Content.scss';

interface Props {
  user: UserRes;
}

const Content = ({ user }: Props) => (
  <div className="content-wrapper">
    <SimpleHeader title="Dane użytkownika:" />
    <Row label={__('application.firstName')} content={user.firstName} />
    <Row label={__('application.lastName')} content={user.lastName} />
    <Row label={__('application.userRole')} content={user.role} />

    <SimpleHeader title="Dane kontaktowe:" />
    <Row label={__('application.mail')} content={user.email} />
    <Row label={__('application.phone')} content={user.phone} />
    <Row label={__('application.city')} content={user.city} />
    <Row label={__('application.street')} content={user.street} />
    <Row label={__('application.postCode')} content={user.postCode} />

    <SimpleHeader title="Dane kontaktowe firmy:" />
    <Row label={__('application.companyName')} content={user.companyData.name} />
    <Row label={__('application.nip')} content={user.companyData.nip} />
    <Row label={__('application.city')} content={user.companyData.city} />
    <Row label={__('application.street')} content={user.companyData.street} />
    <Row label={__('application.postCode')} content={user.companyData.postCode} />
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(Content);
