import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { MyRentList, RentStatus } from 'smartbox-types';
import { Card } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { StockImage } from 'src/icons/StockImage';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { StorageDetails } from 'src/views/DashboardCommon/Welcome/Storage/StorageList/SingleStorage/components/StorageDetails';
import { StorageHeader } from 'src/views/DashboardCommon/Welcome/Storage/StorageList/SingleStorage/components/StorageHeader';
import { StorageMainInfo } from 'src/views/DashboardCommon/Welcome/Storage/StorageList/SingleStorage/components/StorageMainInfo';

interface Props {
  single: MyRentList;
}

const StyledStorage = styled(Link)({
  flex: 1,
  minHeight: 150,
});

const SingleStorage = ({ single }: Props) => {
  const [isHovered, setHovered] = useState(false);
  const { data: user } = useGetMyDetailsQuery();

  const handleHover = () => {
    setHovered(true);
  };

  const handleBlur = () => {
    setHovered(false);
  };

  const isWarning = [
    RentStatus.noPaidExtension,
    RentStatus.noPaidExtensionWithWarning,
    RentStatus.noPaidPeriod,
    RentStatus.endedUnpaid,
  ].includes(single.status);

  const isNotice = [
    RentStatus.pendingFinish,
    RentStatus.awaitingFinish,
  ].includes(single.status);

  return (
    <StyledStorage
      onMouseEnter={handleHover}
      onMouseLeave={handleBlur}
      to={`/${UserService.getSlugByRole(user!.role)}/single-rent/${single.id}`}
    >
      <Card warning={isWarning} notice={isNotice} hovered={isHovered} image={<StockImage />}>
        <StorageHeader
          isWarning={isWarning}
          isHovered={isHovered}
          isNotice={isNotice}
          stockName={single.stockName}
        />
        <StorageMainInfo identifier={single.number} isWarning={isWarning} />
        <StorageDetails
          size={single.size}
          date={single.finishAt}
          agreementType={single.agreementType}
        />
      </Card>
    </StyledStorage>
    // </div>
  );
};

export default SingleStorage;
