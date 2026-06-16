import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { MyRentDetails, RentStatus } from 'smartbox-types';
import { successNotification } from '../../../../../actions/notifications';
import { history } from 'src/history';
import { ConfirmModal } from '../../../../../components/Common';
import { useEndMyRentMutation } from 'src/mutations';

interface Props {
  rent: MyRentDetails;
}

const EndingModal = ({ rent }: Props) => {
  const dispatch = useDispatch();
  const { mutate: endRent, isSuccess, isPending } = useEndMyRentMutation();

  useEffect(() => {
    if (!isSuccess) return;

    dispatch(successNotification('notification.rentFinishManually'));
    history.push('/user/main');
  }, [isSuccess]);

  if (rent.status !== RentStatus.rented) {
    return (
      <ConfirmModal
        mainText="application.youCanNotEndRentNow"
        approveButtonText="application.understood"
        approveAction={() => {}}
        cancelButtonText="application.back"
      />
    );
  }

  return (
    <ConfirmModal
      isLoading={isPending}
      mainText="application.endRental"
      approveButtonText="application.end"
      approveAction={async () => {
        endRent({ rentId: rent.id });
      }}
      cancelButtonText="application.back"
    />
  );
};

export default EndingModal;
