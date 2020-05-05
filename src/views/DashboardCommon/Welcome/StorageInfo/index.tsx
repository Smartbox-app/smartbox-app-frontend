import React from 'react';
import { Button } from '../../../../components/Common';

import './StorageInfo.scss';

interface SingleSotrage {
  size: number;
  location: string;
}

interface Props {
  storageList: SingleSotrage[];
}

const StorageInfo = ({ storageList }: Props) => {
  const ButtonForNew = (
    <div className="new-storage single-wrapper">
      <Button text="Wynajmij Magazyn" outline icon="" to="/admin/order" />
    </div>
  );

  const dataToDisplay = storageList.map((single: SingleSotrage) => (
    <div className="single-wrapper">
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

export default StorageInfo;
