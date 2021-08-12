import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList, RentStatus } from 'smartbox-types';
import { modal, notifications, order, singleRent } from '../../../../../actions';
import { history } from '../../../../../App';
import { ConfirmModal } from '../../../../../components/Common';
import { __ } from '../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../reducers';

interface Props {
  rent: MyRentList;
  endMyRent: (rentId: string) => void;
  successNotification: (text: string) => void;
  getMyRentList: () => void;
}

const EndingModal = ({ endMyRent, successNotification, getMyRentList, rent }: Props) => {
  if (rent.status !== RentStatus.rented) {
    return (
      <ConfirmModal
        mainText={__('application.youCanNotEndRentNow')}
        approveButtonText={__('application.understood')}
        approveAction={() => {}}
        cancelButtonText={__('application.back')}
      />
    );
  }

  return (
    <ConfirmModal
      mainText={__('application.endRental')}
      approveButtonText={__('application.end')}
      approveAction={async () => {
        successNotification(__('notification.rentFinishManually'));
        await endMyRent(rent.id);
        await getMyRentList();
        history.push('/user/main');
      }}
      cancelButtonText={__('application.back')}
    />
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  rent: state.rent.singleRent,
  user: state.user.details,
});

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

export default connect(mapStateToProps, mapDispatchToProps)(EndingModal);
