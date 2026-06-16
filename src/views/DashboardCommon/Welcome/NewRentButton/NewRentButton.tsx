import React from 'react';
import { useDispatch } from 'react-redux';
import { showModal } from '../../../../actions/modal';
import { NoPhoneModal } from '../../../../components/Common/NoPhoneModal';
import UserService from '../../../../services/user-service';
import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import { Button } from '../../../../components/ui';
import { Add } from '../../../../icons';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

export const NewRentButton = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const { getText } = useTenantNaming();

  if (!user) return null;
  return (
    <Button
      text={getText('new_box')}
      size="large"
      iconLeft={<Add />}
      onClick={() => {
        if (!user.phone || user.phone.length < 7) {
          dispatch(showModal(<NoPhoneModal />));
        } else {
          // updateFormData({ size: data.toString() });
          history.push(
            `/${UserService.getSlugByRole(user.role)}/order/step/stock`,
          );
        }
      }}
    />
  );
};
