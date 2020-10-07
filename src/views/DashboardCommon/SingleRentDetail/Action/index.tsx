import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MyRentList, UserRes } from 'smartbox-types';
import { ButtonsContainer } from '../../../../components/Layout';
import { Button, ConfirmModal } from '../../../../components/Common';
import { modal, order, singleRent } from '../../../../actions';
import { __ } from '../../../../helpers/i18n';
import { history } from '../../../../App';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';

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
      <Button text={__('application.goToAgreement')} success click={() => handleExtendingOrderData(rentId)} />
      <Button
        text={__('application.end')}
        danger
        click={() =>
          showModal(
            <ConfirmModal
              mainText="Czy jesteś pewien, że chcesz zakończyć tę umowę?"
              aproveButtonText="Zakończ"
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
