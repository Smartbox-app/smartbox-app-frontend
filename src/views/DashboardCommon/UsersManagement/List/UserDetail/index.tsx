import React from 'react';

import { UserListRes, UserRes, UserRole } from 'smartbox-types';
import { Spinner } from 'src/components/Branded';
import { Row } from 'src/components/Common';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useUserDetailsQuery, useUserNoteQuery } from 'src/queries';

import UserRentList from '../../../UserRentList';

import './UserDetail.scss';

interface Props {
  userId: string;
  userData: UserListRes;
}

const UserDetail = ({ userId, userData }: Props) => {
  const { data: singleUser, isPending: isUserPending } =
    useUserDetailsQuery(userId);
  const { data: noteData, isPending: isNotePending } = useUserNoteQuery(userId);

  if (!userData || isUserPending || !singleUser) return <Spinner />;

  const userDetails = singleUser as UserRes;

  return (
    <>
      <Modal.Header title={__('application.userDetails')} />
      <Modal.Content>
        <Row label="application.firstName" content={userDetails.firstName} />
        <Row label="application.lastName" content={userDetails.lastName} />
        <Row label="application.userRole" content={userDetails.role} />

        <Row label="application.mail" content={userDetails.email} />
        <Row label="application.phone" content={userDetails.phone} />

        <Row label="application.city" content={userDetails.city} />
        <Row label="application.street" content={userDetails.street} />
        <Row label="application.postCode" content={userDetails.postCode} />

        {userDetails.companyData && userDetails.role === UserRole.user && (
          <>
            <Row
              label="application.companyName"
              content={userDetails.companyData.companyName}
            />
            <Row label="application.nip" content={userDetails.companyData.nip} />
            <Row
              label="application.city"
              content={userDetails.companyData.companyCity}
            />
            <Row
              label="application.street"
              content={userDetails.companyData.companyStreet}
            />
            <Row
              label="application.postCode"
              content={userDetails.companyData.companyPostCode}
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
