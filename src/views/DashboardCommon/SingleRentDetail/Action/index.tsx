import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList, RentStatus, UserRes } from 'smartbox-types';
import { modal, order, singleRent } from '../../../../actions';
import { history } from '../../../../App';
import { Button, ConfirmModal } from '../../../../components/Common';
import { ButtonsContainer } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';
import { BoxMapManagement } from '../../index';

interface Props {
  rentId: string;
  user: UserRes;
  rent: MyRentList;
  showModal: (content: React.ReactNode) => void;
  endMyRent: (rentId: string) => void;
  updateFormData: (data: any) => void;
}

const Action = ({ showModal, endMyRent, rentId, updateFormData, rent, user }: Props) => {
  const handleExtendingOrderData = (rentId: string) => {
    updateFormData({ size: rent.size });
    history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration/${rentId}`);
  };

  return (
    <ButtonsContainer max>
      <Button
        text={__('application.showOnStockMap')}
        success
        click={() => showModal(<BoxMapManagement boxNumberToMarkWay={Number(rent.number)} />)}
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
              approveAction={() => endMyRent(rentId)}
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
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Action);
