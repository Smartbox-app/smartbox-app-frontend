import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList, RentStatus, UserRes } from 'smartbox-types';
import { FormType } from '../../../../types/order-form';
import { modal, order, singleRent, notifications } from '../../../../actions';
import { history } from '../../../../App';
import { Button } from '../../../../components/Common';
import { ButtonsContainer } from '../../../../components/Layout';
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
  updateFormData: (data: Partial<FormType>) => void;
  successNotification: (text: string) => void;
  getMyRentList: () => void;
  toggleShowUserStockMap: () => void;
  clearOrder: () => void;
}

const Action = ({
  showModal,
  rentId,
  updateFormData,
  rent,
  user,
  clearOrder,
  showUserStockMap,
  toggleShowUserStockMap,
}: Props) => {
  const handleExtendingOrderData = (rentId: string) => {
    clearOrder();
    updateFormData({ size: rent.size.toString(), stock: rent.stockId });
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration/${rentId}`);
  };

  return (
    <ButtonsContainer max>
      <Button
        text={!showUserStockMap ? 'application.showOnStockMap' : 'application.showDetail'}
        success
        click={() => toggleShowUserStockMap()}
      />
      <Button
        text='application.goToAgreement'
        success
        click={() => handleExtendingOrderData(rentId)}
        disabled={rent.status !== RentStatus.rented}
      />
      <Button text='application.end' danger click={() => showModal(<EndingModal />)} />
      <Button text='application.back' primary to={`/${UserService.getSlugByRole(user.role)}`} />
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
