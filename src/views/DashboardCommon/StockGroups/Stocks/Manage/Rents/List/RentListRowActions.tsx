import React from 'react';
import { useDispatch } from 'react-redux';

import { AdminRentListDetails, UserRole } from 'smartbox-types';
import { hideModal, showModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { Button as UIButton } from 'src/components/ui';
import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

import { RentAuthorizationsForRentModal } from '../../RentAuthorizations/modals/RentAuthorizationsForRentModal';
import { RentHistoryModal } from './RentHistoryModal';

type Props = {
  rent: AdminRentListDetails;
};

export const RentListRowActions = ({ rent }: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const slug = user ? UserService.getSlugByRole(user.role) : '';
  const stockId = rent.stockId;
  const periodsPath = `/${slug}/locations/stocks/${stockId}/rents/${rent.id}/periods`;

  const goToPeriods = () => {
    dispatch(hideModal());
    history.push(periodsPath);
  };

  const openAuthorizationsModal = () => {
    dispatch(
      showModal(
        <RentAuthorizationsForRentModal stockId={stockId} rent={rent} />,
      ),
    );
  };

  const openHistoryModal = () => {
    dispatch(
      showModal(
        <RentHistoryModal rent={rent} description={rent.description} />,
      ),
    );
  };

  return (
    <ButtonsContainer noWrap>
      {rent.stockId && (
        <UIButton
          variant="secondary"
          type="button"
          text="application.rentPeriods"
          onClick={goToPeriods}
        />
      )}
      {user &&
      rent.stockId &&
      [UserRole.admin, UserRole.client].includes(user.role) ? (
        <UIButton
          variant="secondary"
          type="button"
          text="application.rentAuthorizationsRowButton"
          onClick={openAuthorizationsModal}
        />
      ) : null}
      {rent.description &&
      Array.isArray(rent.description) &&
      rent.stockId &&
      rent.description.length > 0 ? (
        <Button
          primary
          text="application.rentHistory"
          click={openHistoryModal}
        />
      ) : null}
    </ButtonsContainer>
  );
};
