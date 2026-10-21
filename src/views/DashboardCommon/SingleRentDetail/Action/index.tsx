import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MyRentDetails, RentStatus } from 'smartbox-types';
import { showModal } from '../../../../actions/modal';
import { clearOrder, updateFormData } from '../../../../actions/order';
import { toggleShowUserStockMap } from '../../../../actions/single-rent';
import { history } from 'src/history';
import { ButtonsContainer } from '../../../../components/Layout';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';
import EndingModal from './EndingModal';
import { useGetMyDetailsQuery } from 'src/queries';
import { Alert } from 'src/components/Common';
import { Button, Tabs } from 'src/components/ui';
import { Calendar, CloseCircle, InfoCircle, Map } from 'src/icons';
import { GateButton } from './GateButton';
import { KsmGateButton } from './KsmGateButton';
import { isOpenEndedAgreement, hasDateValue } from 'src/utils/rent';
import { dateOnly } from 'src/utils/format-date';
import { __ } from 'src/helpers/i18n';

interface Props {
  rent: MyRentDetails;
  isAuthorizedViewer?: boolean;
}

const Action = ({ rent, isAuthorizedViewer = false }: Props) => {
  const dispatch = useDispatch();
  const showUserStockMap = useSelector(
    (state: ApplicationState) => state.rent.showUserStockMap,
  );
  const { data: user } = useGetMyDetailsQuery();

  const handleExtendingOrderData = (rentId: string) => {
    dispatch(clearOrder());
    dispatch(updateFormData({ size: rent.size.toString(), stock: rent.stockId }));
    history.push(
      `/${UserService.getSlugByRole(user!.role)}/order/step/duration/${rentId}`,
    );
  };

  const canExtendRent = useMemo(() => {
    if (isOpenEndedAgreement(rent.agreementType)) return false;
    if (rent.pendingPayments) return false;
    if (rent.status !== RentStatus.rented) return false;
    if ((rent.periods || []).some((period) => !period.paid)) return false;
    return true;
  }, [rent]);

  const canEndRent = useMemo(() => {
    if (rent.status === RentStatus.endedUnpaid) return false;
    if (rent.status === RentStatus.awaitingFinish) {
      if (
        hasDateValue(rent.finishAt) &&
        new Date(rent.finishAt) < new Date()
      ) {
        return false;
      }
      return true;
    }
    if (isOpenEndedAgreement(rent.agreementType)) {
      if (
        hasDateValue(rent.finishAt) &&
        rent.status === RentStatus.rented
      ) {
        return new Date(rent.finishAt) >= new Date();
      }
      if (hasDateValue(rent.finishAt)) return false;
      const now = new Date();
      return !(rent.periods || []).some(
        (period) => !period.paid && new Date(period.startAt) <= now,
      );
    }
    if ((rent.periods || []).some((period) => !period.paid)) return false;
    return true;
  }, [rent]);

  const isPastScheduledFinish =
    isOpenEndedAgreement(rent.agreementType) &&
    hasDateValue(rent.finishAt) &&
    new Date(rent.finishAt) < new Date();
  const isAwaitingFinish =
    !isPastScheduledFinish &&
    (rent.status === RentStatus.awaitingFinish ||
      (isOpenEndedAgreement(rent.agreementType) &&
        hasDateValue(rent.finishAt) &&
        rent.status === RentStatus.rented));
  const isScheduledOpenEndedEnd =
    isOpenEndedAgreement(rent.agreementType) &&
    rent.status !== RentStatus.endedUnpaid &&
    isAwaitingFinish;
  const showEndedUnpaidAlert =
    rent.status === RentStatus.endedUnpaid ||
    (isPastScheduledFinish &&
      (rent.status === RentStatus.awaitingFinish ||
        rent.status === RentStatus.rented));

  let endButtonText = 'application.end';
  if (isAwaitingFinish) {
    endButtonText = 'application.confirmOpenEndedFinish';
  } else if (isOpenEndedAgreement(rent.agreementType)) {
    endButtonText = 'application.endAgreement';
  }

  return (
    <>
      <ButtonsContainer spaceBetween>
        <Tabs
          tabs={[
            {
              text: 'application.showDetail',
              onClick: () => dispatch(toggleShowUserStockMap()),
              icon: <InfoCircle />,
              active: !showUserStockMap,
            },
            {
              text: 'application.showOnStockMap',
              onClick: () => dispatch(toggleShowUserStockMap()),
              icon: <Map />,
              active: showUserStockMap,
            },
          ]}
        />
        <ButtonsContainer>
          {rent.gates
            .filter((gate) => !!gate.controlled)
            .map((gate) =>
              gate.version === 2 ? (
                <KsmGateButton key={gate.id} gate={gate} withName={rent.gates.length > 1}/>
              ) : (
                <GateButton key={gate.id} gate={gate} withName={rent.gates.length > 1} />
              ),
            )}
          {!isAuthorizedViewer ? (
            <>
              {!isOpenEndedAgreement(rent.agreementType) ? (
              <Button
                iconLeft={<Calendar />}
                text="application.goToAgreement"
                onClick={() => handleExtendingOrderData(rent.id)}
                disabled={!canExtendRent}
              />
              ) : null}
              <Button
                disabled={!canEndRent}
                iconLeft={<CloseCircle />}
                text={endButtonText}
                variant="error"
                onClick={() => dispatch(showModal(<EndingModal rent={rent} />))}
              />
            </>
          ) : null}
        </ButtonsContainer>
      </ButtonsContainer>
      {!isAuthorizedViewer &&
      !isOpenEndedAgreement(rent.agreementType) &&
      !canExtendRent ? (
        <Alert type="notice" text="application.cantExtendDescription" />
      ) : null}
      {!isAuthorizedViewer && showEndedUnpaidAlert ? (
        <Alert type="error" text="application.endedUnpaidContactStock" />
      ) : null}
      {!isAuthorizedViewer && isScheduledOpenEndedEnd ? (
        <Alert type="notice">
          {__(
            isAwaitingFinish
              ? 'application.openEndedAwaitingFinishInfo'
              : 'application.openEndedAccessUntil',
            {
              date: dateOnly(rent.finishAt),
            },
          )}
        </Alert>
      ) : null}
      {!isAuthorizedViewer &&
      rent.status !== RentStatus.endedUnpaid &&
      !isScheduledOpenEndedEnd &&
      !canEndRent ? (
        <Alert type="notice" text="application.cantEndDescription" />
      ) : null}
    </>
  );
};

export default Action;
