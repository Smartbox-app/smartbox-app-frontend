import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserListRes, UserRes, UserRole } from 'smartbox-types';
import { user } from '../../../../../actions';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

import './UserDetail.scss';
import { ApplicationState } from '../../../../../reducers';
import UserRentList from 'src/views/DashboardCommon/UserRentList';
import { Row } from 'src/components/Common';
import { Spinner } from 'src/components/Branded';
import { useUserNoteQuery } from 'src/queries';

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
  const { data: noteData, isPending: isNotePending } = useUserNoteQuery(userId);

  useEffect(() => {
    fetchSingleUser(userId);
  }, []);

  if (!userData) return <Spinner />;

  return (
    <>
      <Modal.Header title={__('application.userDetails')} />
      <Modal.Content>
        <Row label="application.firstName" content={singleUser.firstName} />
        <Row label="application.lastName" content={singleUser.lastName} />
        <Row label="application.userRole" content={singleUser.role} />

        <Row label="application.mail" content={singleUser.email} />
        <Row label="application.phone" content={singleUser.phone} />

        <Row label="application.city" content={singleUser.city} />
        <Row label="application.street" content={singleUser.street} />
        <Row label="application.postCode" content={singleUser.postCode} />

        {singleUser.companyData && singleUser.role === UserRole.user && (
          <>
            <Row
              label="application.companyName"
              content={singleUser.companyData.companyName}
            />
            <Row label="application.nip" content={singleUser.companyData.nip} />
            <Row
              label="application.city"
              content={singleUser.companyData.companyCity}
            />
            <Row
              label="application.street"
              content={singleUser.companyData.companyStreet}
            />
            <Row
              label="application.postCode"
              content={singleUser.companyData.companyPostCode}
            />
          </>
        )}

        {isNotePending ? null : (
          <Row
            label="application.userNote"
            content={noteData?.note || __('application.lack')}
          />
        )}

        <UserRentList userId={userId} />
      </Modal.Content>
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
