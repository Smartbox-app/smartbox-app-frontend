import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserListRes, UserRes } from 'smartbox-types';
import { user } from '../../../../../actions';
import { SimpleHeader } from '../../../../../components/Layout';

import './UserDetail.scss';
import { ApplicationState } from '../../../../../reducers';
import DataGroup from './DataGroup';
import UserRentList from './UserRentList';

interface Props {
  userId: string;
  userData: UserListRes;
  fetchSingleUser: (userId: string) => void;
  singleUser: UserRes | any;
}

const UserDetail = ({ userId, userData, fetchSingleUser, singleUser }: Props) => {
  useEffect(() => {
    fetchSingleUser(userId);
  }, []);

  return (
    <div className="user-detail-wrapper">
      <SimpleHeader title='application.customerDetails' />
      <div className="single-address-content">
        <div className="addresses-wrapper">
          <DataGroup
            icon="fa-home"
            title='application.customerData'
            rowData={[
              `${singleUser?.firstName} ${singleUser?.lastName}`,
              singleUser?.phone,
              singleUser?.street,
              singleUser?.city,
              singleUser?.postCode,
            ]}
          />
          <DataGroup
            icon="fa-file-o"
            title='application.customerCompanyData'
            rowData={[
              singleUser?.companyData?.companyName,
              singleUser?.companyData?.companyStreet,
              singleUser?.companyData?.companyCity,
              singleUser?.companyData?.companyPostCode,
              singleUser?.companyData?.nip,
            ]}
          />
          <UserRentList rentList={singleUser?.activeRents || []} />
        </div>
      </div>
    </div>
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
