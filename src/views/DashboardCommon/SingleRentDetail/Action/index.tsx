import React, { useMemo } from 'react';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentDetails, RentStatus } from 'smartbox-types';
import { FormType } from '../../../../types/order-form';
import { modal, order, singleRent, notifications } from '../../../../actions';
import { history } from '../../../../App';
import { ButtonsContainer } from '../../../../components/Layout';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';
import EndingModal from './EndingModal';
import { __ } from '../../../../helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import { Alert } from 'src/components/Common';
import { Button, Tabs } from 'src/components/ui';
import { Calendar, CloseCircle, InfoCircle, Map } from 'src/icons';
import { GateButton } from './GateButton';

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
      <ButtonsContainer spaceBetween>
        <Tabs
          tabs={[
            {
              text: 'application.showDetail',
              onClick: toggleShowUserStockMap,
              icon: <InfoCircle />,
              active: !showUserStockMap,
            },
            {
              text: 'application.showOnStockMap',
              onClick: toggleShowUserStockMap,
              icon: <Map />,
              active: showUserStockMap,
            },
          ]}
        />
        <ButtonsContainer>
          <Button
            iconLeft={<Calendar />}
            text="application.goToAgreement"
            onClick={() => handleExtendingOrderData(rent.id)}
            disabled={!canExtendRent}
          />
          <Button
            disabled={!canEndRent}
            iconLeft={<CloseCircle />}
            text="application.end"
            variant="error"
            onClick={() => showModal(<EndingModal rent={rent} />)}
          />
        { rent.gates.filter(gate => !!gate.controlled).map(gate => <GateButton gate={gate} key={gate.id} />)}
          
        </ButtonsContainer>
      </ButtonsContainer>
      {!canExtendRent ? (
        <Alert type="notice" text="application.cantExtendDescription" />
      ) : null}
      {!canEndRent ? (
        <Alert type="notice" text="application.cantEndDescription" />
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
