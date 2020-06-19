import React from 'react';
import { MyRentList } from 'smartbox-types';

import SingleStorage from './SingleStorage';
import ButtonForNew from './ButtonForNew';

import './StorageList.scss';

interface Props {
  list: MyRentList[];
}

const StorageInfo = ({ list }: Props) => {
  const dataToDisplay = list.map((single: MyRentList, key: number) => (
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
