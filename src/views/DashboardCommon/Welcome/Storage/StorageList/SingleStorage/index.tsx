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
import { StorageBackground } from './components/StorageBackground';

interface Props {
  single: MyRentList;
}

const StyledStorage = styled(Link)(({ theme }) => ({
  borderRadius: theme.radius.innerSurface,
  background: theme.colors.background.primary,
  boxShadow: theme.shadows.primary,
  padding: `${theme.spacing * 4}px ${theme.spacing * 4}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  overflow: 'hidden',
  gap: theme.spacing * 3,
  position: 'relative',
  zIndex: 1,
  flex: 1,
  minHeight: 150,
}));

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
  ].includes(single.status);
  return (
    <StyledStorage
      onMouseEnter={handleHover}
      onMouseLeave={handleBlur}
      to={`/${UserService.getSlugByRole(user!.role)}/single-rent/${single.id}`}
    >
      <StorageBackground isWarning={isWarning} isHovered={isHovered} />
      <StorageHeader
        isWarning={isWarning}
        isHovered={isHovered}
        stockName={single.stockName}
      />
      <StorageMainInfo identifier={single.number} isWarning={isWarning} />
      {/* {isWarning && <div className="storage-warning-overlay" />} */}

      <StorageDetails size={single.size} date={single.finishAt} />
    </StyledStorage>
    // </div>
  );
};

export default SingleStorage;
