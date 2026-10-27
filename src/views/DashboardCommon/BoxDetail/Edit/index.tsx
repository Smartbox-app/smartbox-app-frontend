import { BoxDisplayStatus, RentStatus } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries';
import { isAdminOrTenant } from 'src/utils/role-check';
import Position from 'src/views/DashboardCommon/BoxDetail/Edit/Position';
import Status from 'src/views/DashboardCommon/BoxDetail/Edit/Status';

import 'src/views/DashboardCommon/BoxDetail/Edit/Edit.scss';

interface Props {
  selectedBoxId: string;
  rentId: string;
  singleBoxDetailStatus: BoxDisplayStatus;
  display: boolean;
  stockId: string;
  callback?: () => void;
}

export const Edit = ({
  selectedBoxId,
  rentId,
  singleBoxDetailStatus,
  display,
  stockId,
}: Props) => {
  const { data: user } = useGetMyDetailsQuery();
  if (!user) return null;
  if (singleBoxDetailStatus === RentStatus.reserved) return null;
  return (
    <div className={`edit-wrapper ${display && 'show-me'}`}>
      <Status
        selectedBoxId={selectedBoxId}
        stockId={stockId}
        rentId={rentId}
        currentStatus={singleBoxDetailStatus}
      />
      {isAdminOrTenant(user.role) &&
        rentId !== '' &&
        singleBoxDetailStatus === RentStatus.rented && (
          <Position rentId={rentId} />
        )}
    </div>
  );
};
