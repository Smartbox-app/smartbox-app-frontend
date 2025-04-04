import { MyRentList } from 'smartbox-types';
import { Alert } from '../../../../../components/Common';

import SingleStorage from './SingleStorage';

import './StorageList.scss';

interface Props {
  list: MyRentList[];
}

const StorageInfo = ({ list }: Props) => {
  if (list.length === 0)
    return <Alert type="notice" text="application.noActiveRent" />;

  const dataToDisplay = list.map((single: MyRentList, key: number) => (
    <SingleStorage key={`storage-info-${key}`} single={single} />
  ));

  return <div className="storage-info-wrapper">{dataToDisplay}</div>;
};

export default StorageInfo;
