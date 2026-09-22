import React from 'react';
import { useDispatch } from 'react-redux';
import { showModal } from '../../../../actions/modal';
import { NoPhoneModal } from '../../../../components/Common/NoPhoneModal';
import { UnpaidRentModal } from '../../../../components/Common/UnpaidRentModal';
import UserService from '../../../../services/user-service';
import { history } from 'src/history';
import { useGetMyDetailsQuery, useGetMyRentsQuery } from 'src/queries';
import { Button } from '../../../../components/ui';
import { Add } from '../../../../icons';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
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
