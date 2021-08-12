import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList, RentStatus, UserRes } from 'smartbox-types';
import { modal, order, singleRent, notifications } from '../../../../actions';
import { history } from '../../../../App';
import { Button, ConfirmModal } from '../../../../components/Common';
import { ButtonsContainer } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';
import EndingModal from './EndingModal';

interface Props {
  rentId: string;
  showUserStockMap: boolean;
  user: UserRes;
  rent: MyRentList;
  showModal: (content: React.ReactNode) => void;
  endMyRent: (rentId: string) => void;
  updateFormData: (data: any) => void;
  successNotification: (text: string) => void;
  getMyRentList: () => void;
  toggleShowUserStockMap: () => void;
}

const Action = ({
  showModal,
  endMyRent,
  rentId,
  updateFormData,
  rent,
  user,
  showUserStockMap,
  getMyRentList,
  toggleShowUserStockMap,
  successNotification,
}: Props) => {
  const handleExtendingOrderData = (rentId: string) => {
    updateFormData({ size: rent.size });
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration/${rentId}`);
  };

  return (
    <ButtonsContainer max>
      <Button
        text={!showUserStockMap ? __('application.showOnStockMap') : __('application.showDetail')}
        success
        click={() => toggleShowUserStockMap()}
      />
      <Button
        text={__('application.goToAgreement')}
        success
        click={() => handleExtendingOrderData(rentId)}
        disabled={rent.status !== RentStatus.rented}
      />
      <Button text={__('application.end')} danger click={() => showModal(<EndingModal />)} />
      <Button text={__('application.back')} primary to={`/${UserService.getSlugByRole(user.role)}`} />
    </ButtonsContainer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  rent: state.rent.singleRent,
  user: state.user.details,
  showUserStockMap: state.rent.showUserStockMap,
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
