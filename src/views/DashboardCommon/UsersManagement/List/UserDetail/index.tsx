import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserListRes, UserRes, UserRole } from 'smartbox-types';
import { fetchSingleUser } from '../../../../../actions/users';
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
}

const UserDetail = ({ userId, userData }: Props) => {
  const dispatch = useDispatch();
  const singleUser = useSelector(
    (state: ApplicationState) => state.user.singleUser,
  ) as UserRes;
  const { data: noteData, isPending: isNotePending } = useUserNoteQuery(userId);

  useEffect(() => {
    dispatch(fetchSingleUser(userId));
  }, [dispatch, userId]);

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

export default UserDetail;
