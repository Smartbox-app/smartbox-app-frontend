import React from 'react';

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
    <div>
      <h1>Wynajmij Magazyn</h1>
    </div>
  );

  const dataToDisplay = storageList.map(() => (
    <div className="storage">
      <p className="main-info">12m2</p>
      <p className="sec-info">Katowice, Ligota</p>
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
