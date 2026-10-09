import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { MyRentList } from 'smartbox-types';
import { modal } from 'src/actions';
import { clearOrder, updateFormData } from 'src/actions/order';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import {
  isUnpaidPeriodStatus,
  isEndedUnpaidStatus,
} from 'src/utils/unpaid-extension';
import Alert from '../Alert';

export type UnpaidRentModalProps = {
  rent: MyRentList;
};

export const UnpaidRentModal = ({ rent }: UnpaidRentModalProps) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();

  const close = () => {
    dispatch(modal.hideModal());
  };

  const goPay = () => {
    if (!user) return;
    close();

    if (isUnpaidPeriodStatus(rent.status)) {
      history.push(
        `/${UserService.getSlugByRole(user.role)}/single-rent/${rent.id}`,
      );
      return;
    }

    dispatch(clearOrder());
    dispatch(
      updateFormData({ size: rent.size.toString(), stock: rent.stockId }),
    );
    history.push(
      `/${UserService.getSlugByRole(user.role)}/order/step/duration/${rent.id}`,
    );
  };

  const status = useMemo(() => {
    if (isEndedUnpaidStatus(rent.status))
      return 'application.cannotStartNewRentEndedUnpaid';
    if (isUnpaidPeriodStatus(rent.status))
      return 'application.cannotStartNewRentUnpaidPeriod';

    return 'application.cannotStartNewRentUnpaid';
  }, [rent.status]);

  return (
    <>
      <Modal.Header title={__('application.cannotStartNewRentUnpaidTitle')} />
      <Modal.Content>
        <Alert type="error" text={status} />
      </Modal.Content>
      <Modal.Actions>
        <ButtonsContainer>
          <Button
            variant="secondary"
            text="application.understood"
            onClick={close}
            type="button"
          />
          {!isEndedUnpaidStatus(rent.status) && (
            <Button
              variant="primary"
              text="application.payOffDebt"
              onClick={goPay}
              type="button"
            />
          )}
        </ButtonsContainer>
      </Modal.Actions>
    </>
  );
};
