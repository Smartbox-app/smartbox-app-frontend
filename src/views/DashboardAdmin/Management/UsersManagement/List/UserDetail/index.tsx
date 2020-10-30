import React from 'react';
import { UserListRes } from 'smartbox-types';
import { SectionHeader } from '../../../../../../components/Layout';
import { __ } from '../../../../../../helpers/i18n';

import './UserDetail.scss';

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
          <div className="single-address">
            <div className="single-address-logo">
              <i className="fa fa-home" aria-hidden="true" />
            </div>
            <div className="single-address-content">
              <p className="single-address-header">{__('application.customerData')}:</p>
              <p>
                {userData.firstName} {userData.lastName}
              </p>
              <p>{userData.phone}</p>
              <p>{userData.street}</p>
              <p>{userData.city}</p>
              <p>{userData.postCode}</p>
            </div>
          </div>
        </div>
        <div className="single-address">
          <div className="single-address-logo">
            <i className="fa fa-file-o" aria-hidden="true" />
          </div>
          <div className="single-address-content">
            <p className="single-address-header">{__('application.customerCompanyData')}:</p>
            <p>{userData.companyData.name}</p>
            <p>{userData.companyData.street}</p>
            <p>{userData.companyData.city}</p>
            <p>{userData.companyData.postCode}</p>
            <p>{userData.companyData.nip}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
