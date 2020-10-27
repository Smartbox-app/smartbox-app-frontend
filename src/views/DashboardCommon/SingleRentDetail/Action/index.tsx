import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList, RentStatus, UserRes } from 'smartbox-types';
import { modal, order, singleRent, notifications } from '../../../../actions';
import { history } from '../../../../App';
import { Button, ConfirmModal } from '../../../../components/Common';
import UserStockMap from '../../../../components/Common/UserStockMap';
import { ButtonsContainer } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';

interface Props {
  rentId: string;
  user: UserRes;
  rent: MyRentList;
  showModal: (content: React.ReactNode) => void;
  endMyRent: (rentId: string) => void;
  updateFormData: (data: any) => void;
  successNotification: (text: string) => void;
  getMyRentList: () => void;
}

const Action = ({
  showModal,
  endMyRent,
  rentId,
  updateFormData,
  rent,
  user,
  getMyRentList,
  successNotification,
}: Props) => {
  const handleExtendingOrderData = (rentId: string) => {
    updateFormData({ size: rent.size });
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration/${rentId}`);
  };

  return (
    <ButtonsContainer max>
      <Button
        text={__('application.showOnStockMap')}
        success
        click={() => showModal(<UserStockMap boxNumberToMarkWay={Number(rent.number)} />)}
      />
      <Button
        text={__('application.goToAgreement')}
        success
        click={() => handleExtendingOrderData(rentId)}
        disabled={rent.status !== RentStatus.rented}
      />
      <Button
        text={__('application.end')}
        danger
        click={() =>
          showModal(
            <ConfirmModal
              mainText={__('application.endRental')}
              approveButtonText={__('application.end')}
              approveAction={async () => {
                successNotification(__('notification.rentFinishManually'));
                await endMyRent(rentId);
                await getMyRentList();
                history.push('/user/main');
              }}
              cancelButtonText={__('application.back')}
            />,
          )
        }
      />
      <Button text={__('application.back')} primary to={`/${UserService.getSlugByRole(user.role)}`} />
    </ButtonsContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(Action);
