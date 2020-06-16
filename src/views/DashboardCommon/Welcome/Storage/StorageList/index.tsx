import React from 'react';

import SingleStorage from './SingleStorage';
import ButtonForNew from './ButtonForNew';

import './StorageList.scss';

export interface SingleStorageType {
  size: number;
  location: string;
}

interface Props {
  list: SingleStorageType[];
}

const StorageInfo = ({ list }: Props) => {
  const dataToDisplay = list.map((single: SingleStorageType, key: number) => (
    <SingleStorage key={`storage-info-${key}`} single={single} />
  ));

  return (
    <div className="storage-info-wrapper">
      {dataToDisplay}
      <ButtonForNew />
    </div>
  );
};

export default StorageInfo;
