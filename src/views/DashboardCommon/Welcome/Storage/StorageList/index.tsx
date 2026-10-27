import { MyRentList } from 'smartbox-types';
import { Alert } from 'src/components/Common';
import { Skeleton } from 'src/components/ui';
import SingleStorage from 'src/views/DashboardCommon/Welcome/Storage/StorageList/SingleStorage';

import 'src/views/DashboardCommon/Welcome/Storage/StorageList/StorageList.scss';

interface Props {
  list: MyRentList[];
  loading: boolean;
}

const StorageInfo = ({ list, loading }: Props) => {
  if (loading)
    return (
      <div className="storage-info-wrapper">
        <Skeleton height={150} radius={16} />
        <Skeleton height={150} radius={16} />
        <Skeleton height={150} radius={16} />
      </div>
    );

  if (list.length === 0)
    return <Alert type="notice" text="application.noActiveRent" />;

  const dataToDisplay = list.map((single: MyRentList, key: number) => (
    <SingleStorage key={`storage-info-${key}`} single={single} />
  ));

  return <div className="storage-info-wrapper">{dataToDisplay}</div>;
};

export default StorageInfo;
