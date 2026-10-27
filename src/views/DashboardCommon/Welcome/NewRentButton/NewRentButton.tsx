import React from 'react';
import { useDispatch } from 'react-redux';

import { showModal } from 'src/actions/modal';
import { NoPhoneModal } from 'src/components/Common/NoPhoneModal';
import { UnpaidRentModal } from 'src/components/Common/UnpaidRentModal';
import { Button } from 'src/components/ui';
import { history } from 'src/history';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { Add } from 'src/icons';
import { useGetMyDetailsQuery, useGetMyRentsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { findUnpaidRent } from 'src/utils/unpaid-extension';

export const NewRentButton = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const { data: rentsList = [], isPending: loadingRents } =
    useGetMyRentsQuery();
  const { getText } = useTenantNaming();

  const handleNewRent = () => {
    if (loadingRents || !user) return;

    const unpaidRent = findUnpaidRent(rentsList);

    if (unpaidRent) {
      dispatch(showModal(<UnpaidRentModal rent={unpaidRent} />));
      return;
    }
    if (!user.phone || user.phone.length < 7) {
      dispatch(showModal(<NoPhoneModal />));
    } else {
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
    }
  };

  return (
    <Button
      text={getText('new_box')}
      size="large"
      iconLeft={<Add />}
      disabled={loadingRents}
      onClick={handleNewRent}
    />
  );
};
