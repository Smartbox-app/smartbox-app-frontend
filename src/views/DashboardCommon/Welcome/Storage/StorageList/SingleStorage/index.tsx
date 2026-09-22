import { useState } from 'react';
import { MyRentList, RentStatus } from 'smartbox-types';
import styled from 'styled-components';

import UserService from '../../../../../../services/user-service';

import { __ } from '../../../../../../helpers/i18n';

import { useGetMyDetailsQuery } from 'src/queries';
import { Link } from 'react-router-dom';
import { StorageHeader } from './components/StorageHeader';
import { StorageMainInfo } from './components/StorageMainInfo';
import { StorageDetails } from './components/StorageDetails';
import { Card } from 'src/components/ui';
import { StockImage } from 'src/icons/StockImage';

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
  ].includes(single.status);

  const isNotice = [
    RentStatus.pendingFinish
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
        <StorageDetails size={single.size} date={single.finishAt} />
      </Card>
    </StyledStorage>
    // </div>
  );
};

export default SingleStorage;
