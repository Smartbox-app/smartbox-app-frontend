import React from 'react';
import { connect } from 'react-redux';
import { IUser } from 'smartbox-types';
import { Button } from '../../../../components/Common';
import UserService from '../../../../services/user-service';

import './StorageInfo.scss';

interface SingleSotrage {
  size: number;
  location: string;
}

interface Props {
  storageList: SingleSotrage[];
  user: IUser;
}

const StorageInfo = ({ storageList, user }: Props) => {
  const ButtonForNew = (
    <div className="new-storage single-wrapper">
      <Button
        text="Nowy magazyn"
        outline
        icon="plus.svg"
        to={`/${UserService.getSlugByRole(user.role)}/order/step/1`}
      />
    </div>
  );

  const dataToDisplay = storageList.map((single: SingleSotrage, key: number) => (
    <div className="single-wrapper" key={`storage-info-${key}`}>
      <div className="storage">
        <p className="main-info">{single.size}m2</p>
        <p className="sec-info">{single.location}</p>
      </div>
    </div>
  ));

  return (
    <div className="storage-info-wrapper">
      {dataToDisplay}
      {ButtonForNew}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  user: state.user.details,
});

export default connect(mapStateToProps)(StorageInfo);
