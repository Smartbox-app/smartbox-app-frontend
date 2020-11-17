import React from 'react';
import { UserListRes } from 'smartbox-types';
import { SectionHeader } from '../../../../../../components/Layout';
import { __ } from '../../../../../../helpers/i18n';

import './UserDetail.scss';
import DataGroup from './DataGroup';
import UserRentList from './UserRentList';

interface Props {
  userId: string;
  userData: UserListRes;
}

const UserDetail = ({ userId, userData }: Props) => {
  return (
    <div className="user-detail-wrapper">
      <SectionHeader title={__('application.customerDetails')} />
      <div className="single-address-content">
        <div className="addresses-wrapper">
          <DataGroup
            icon="fa-home"
            title={__('application.customerData')}
            rowData={[
              `${userData?.firstName} ${userData?.lastName}`,
              userData?.phone,
              userData?.street,
              userData?.city,
              userData?.postCode,
            ]}
          />
          <DataGroup
            icon="fa-file-o"
            title={__('application.customerCompanyData')}
            rowData={[
              userData?.companyData?.name,
              userData?.companyData?.street,
              userData?.companyData?.city,
              userData?.companyData?.postCode,
              userData?.companyData?.nip,
            ]}
          />
          <UserRentList
            rentList={[
              {
                number: 502,
                startDate: new Date(),
                endDate: new Date(),
              },
              {
                number: 501,
                startDate: new Date(),
                endDate: new Date(),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
