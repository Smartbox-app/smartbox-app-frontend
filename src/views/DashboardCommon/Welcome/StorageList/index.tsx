import React from 'react';
import { connect } from 'react-redux';
import { IUser } from 'smartbox-types';
import { Button } from '../../../../components/Common';
import UserService from '../../../../services/user-service';

import './StorageList.scss';
import SingleStorage from './SingleStorage';

export interface SingleStorageType {
  size: number;
  location: string;
}

interface Props {
  list: SingleStorageType[];
  user: IUser;
}

const StorageInfo = ({ list, user }: Props) => {
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

  const dataToDisplay = list.map((single: SingleStorageType, key: number) => (
    <SingleStorage key={`storage-info-${key}`} single={single} />
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
