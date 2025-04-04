import React, { useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentDetails, RentStatus } from 'smartbox-types';
import { FormType } from '../../../../types/order-form';
import { modal, order, singleRent, notifications } from '../../../../actions';
import { history } from '../../../../App';
import { Button } from '../../../../components/Branded';
import { ButtonsContainer } from '../../../../components/Layout';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';
import EndingModal from './EndingModal';
import { __ } from '../../../../helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';

interface Props {
  isMapActive: boolean;
  showUserStockMap: boolean;
  rent: MyRentDetails;
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
  updateFormData,
  rent,
  clearOrder,
  showUserStockMap,
  toggleShowUserStockMap,
  isMapActive,
}: Props) => {
  const { data: user } = useGetMyDetailsQuery();

  const handleExtendingOrderData = (rentId: string) => {
    clearOrder();
    updateFormData({ size: rent.size.toString(), stock: rent.stockId });
    history.push(
      `/${UserService.getSlugByRole(user!.role)}/order/step/duration/${rentId}`,
    );
  };

  const canExtendRent = useMemo(() => {
    if (rent.status !== RentStatus.rented) return false;
    if (rent.periods.some((period) => !period.paid)) return false;
    return true;
  }, [rent]);

  const canEndRent = useMemo(() => {
    if (rent.periods.some((period) => !period.paid)) return false;
    return true;
  }, [rent]);

  return (
    <>
      <ButtonsContainer max>
        {isMapActive ? (
          <Button
            text={
              !showUserStockMap
                ? 'application.showOnStockMap'
                : 'application.showDetail'
            }
            success
            click={() => toggleShowUserStockMap()}
          />
        ) : null}
        <Button
          text="application.goToAgreement"
          success
          click={() => handleExtendingOrderData(rent.id)}
          disabled={!canExtendRent}
        />
        <Button
          disabled={!canEndRent}
          text="application.end"
          danger
          click={() => showModal(<EndingModal rent={rent} />)}
        />
        <Button
          text="application.back"
          primary
          to={`/${UserService.getSlugByRole(user!.role)}`}
        />
      </ButtonsContainer>
      {!canExtendRent ? (
        <p>
          <span className="fa fa-info-circle" />{' '}
          {__('application.cantExtendDescription')}
        </p>
      ) : null}
      {!canEndRent ? (
        <p>
          <span className="fa fa-info-circle" />{' '}
          {__('application.cantEndDescription')}
        </p>
      ) : null}
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
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
