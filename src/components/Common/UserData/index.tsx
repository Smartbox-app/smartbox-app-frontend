import React from 'react';
import { connect } from 'react-redux';
import { UserRes, UserRole } from 'smartbox-types';
import { SimpleHeader, Section, SectionHeader } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { __ } from '../../../helpers/i18n';
import { Row } from '../../../components/Common';

// import './UserData.scss';

interface Props {
  user: UserRes;
}

const UserData = ({ user }: Props) => {
  const { role } = user;
  return (
    <div className="content-wrapper">
      <Section highlight>
        <SectionHeader title="Dane użytkownika:" />
        <Row label={__('application.firstName')} content={user.firstName} />
        <Row label={__('application.lastName')} content={user.lastName} />
        <Row label={__('application.userRole')} content={user.role} />
      </Section>
      <Section highlight>
        <SectionHeader title="Dane kontaktowe:" />
        <Row label={__('application.mail')} content={user.email} />
        <Row label={__('application.phone')} content={user.phone} />
        {role === UserRole.user && (
          <>
            <Row label={__('application.city')} content={user.city} />
            <Row label={__('application.street')} content={user.street} />
            <Row label={__('application.postCode')} content={user.postCode} />
          </>
        )}
      </Section>
      {role === UserRole.user && (
        <Section highlight>
          <SectionHeader title="Dane kontaktowe firmy:" />
          <Row label={__('application.companyName')} content={user.companyData.companyName} />
          <Row label={__('application.nip')} content={user.companyData.nip} />
          <Row label={__('application.city')} content={user.companyData.companyCity} />
          <Row label={__('application.street')} content={user.companyData.companyStreet} />
          <Row label={__('application.postCode')} content={user.companyData.companyPostCode} />
        </Section>
      )}
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(UserData);
