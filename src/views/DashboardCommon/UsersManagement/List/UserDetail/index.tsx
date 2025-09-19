import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserListRes, UserRes, UserRole } from 'smartbox-types';
import { user } from '../../../../../actions';
import {
  Section,
  SectionHeader,
  SimpleHeader,
} from '../../../../../components/Layout';

import './UserDetail.scss';
import { ApplicationState } from '../../../../../reducers';
import DataGroup from './DataGroup';
import UserRentList from 'src/views/DashboardCommon/UserRentList';
import { Row } from 'src/components/Common';
import { Spinner } from 'src/components/Branded';

interface Props {
  userId: string;
  userData: UserListRes;
  fetchSingleUser: (userId: string) => void;
  singleUser: UserRes | any;
}

const UserDetail = ({
  userId,
  userData,
  fetchSingleUser,
  singleUser,
}: Props) => {
  useEffect(() => {
    fetchSingleUser(userId);
  }, []);

  if (!userData) return <Spinner />;
  return (
    <>
      <Section highlight>
        <SectionHeader title="application.userData" />
        <Row label="application.firstName" content={userData.firstName} />
        <Row label="application.lastName" content={userData.lastName} />
        <Row label="application.userRole" content={userData.role} />
      </Section>
      <Section highlight>
        <SectionHeader title="application.contactData" />
        <Row label="application.mail" content={userData.email} />
        <Row label="application.phone" content={userData.phone} />
        {userData.role === UserRole.user && (
          <>
            <Row label="application.city" content={userData.city} />
            <Row label="application.street" content={userData.street} />
            <Row label="application.postCode" content={userData.postCode} />
          </>
        )}
      </Section>
      {userData.companyData && userData.role === UserRole.user && (
        <Section highlight>
          <SectionHeader title="application.contactCompanyData" />
          <Row
            label="application.companyName"
            content={userData.companyData.companyName}
          />
          <Row label="application.nip" content={userData.companyData.nip} />
          <Row
            label="application.city"
            content={userData.companyData.companyCity}
          />
          <Row
            label="application.street"
            content={userData.companyData.companyStreet}
          />
          <Row
            label="application.postCode"
            content={userData.companyData.companyPostCode}
          />
          {/* USER CANT CHANGE HIS COMPANY DATA */}
          {/* <ButtonsContainer>
          <Button
            text="application.edit"
            primary
            click={() => dispatch(showModal(<UpdateCompany />))}
          />
        </ButtonsContainer> */}
        </Section>
      )}
      <UserRentList rentList={singleUser?.activeRents || []} />
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleUser: state.user.singleUser,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...user,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
