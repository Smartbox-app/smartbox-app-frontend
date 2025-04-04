import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentDetails, RentStatus } from 'smartbox-types';
import {
  modal,
  notifications,
  order,
  singleRent,
} from '../../../../../actions';
import { history } from '../../../../../App';
import { ConfirmModal } from '../../../../../components/Common';

interface Props {
  rent: MyRentDetails;
  endMyRent: (rentId: string) => void;
  successNotification: (text: string) => void;
  getMyRentList: () => void;
}

const EndingModal = ({
  endMyRent,
  successNotification,
  getMyRentList,
  rent,
}: Props) => {
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
      mainText="application.endRental"
      approveButtonText="application.end"
      approveAction={async () => {
        successNotification('notification.rentFinishManually');
        endMyRent(rent.id);
        getMyRentList();
        history.push('/user/main');
      }}
      cancelButtonText="application.back"
    />
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...singleRent,
      ...order,
      ...notifications,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(EndingModal);
