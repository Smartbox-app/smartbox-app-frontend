import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { RentStatus } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { ProgressIndicator } from 'src/components/Common';
import { UnpaidRentModal } from 'src/components/Common/UnpaidRentModal';
import { PageHeader, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import {
  useGetMyDetailsQuery,
  useGetMyRentsQuery,
  useMyRentDetailsQuery,
} from 'src/queries';
import UserService from 'src/services/user-service';
import { findUnpaidRent } from 'src/utils/unpaid-extension';

type OrderStep =
  | 'stock'
  | 'size'
  | 'duration'
  | 'summary'
  | 'agreement'
  | 'payment';

type OrderFrame = {
  step: OrderStep;
  rentId?: string;
};

const stepIndex: Record<OrderStep, number> = {
  stock: 1,
  size: 2,
  duration: 3,
  summary: 4,
  agreement: 5,
  payment: 6,
};

const OrderStepContext = React.createContext<(frame: OrderFrame) => void>(
  () => {},
);

export const useOrderStep = (step: OrderStep) => {
  const setFrame = useContext(OrderStepContext);
  const { rentId } = useParams<{ rentId?: string }>();

  useLayoutEffect(() => {
    setFrame({ step, rentId });
  }, [rentId, setFrame, step]);
};

const OrderProgress = ({ step }: { step: OrderStep }) => {
  const { getText } = useTenantNaming();

  return (
    <Section>
      <ProgressIndicator
        current={stepIndex[step]}
        stepList={[
          { value: 1, desc: getText('name') },
          { value: 2, desc: 'application.orderStepSize' },
          { value: 3, desc: 'application.orderStepDate' },
          { value: 4, desc: 'application.orderStepSummary' },
          { value: 5, desc: 'application.orderStepAgreement' },
          { value: 6, desc: 'application.orderStepPayment' },
        ]}
      />
    </Section>
  );
};

type RouteWithIndicatorProps = {
  children: React.ReactNode;
};

export const RouteWithIndicator = ({ children }: RouteWithIndicatorProps) => {
  const dispatch = useDispatch();
  const [frame, setFrame] = useState<OrderFrame | null>(null);
  const { data: user } = useGetMyDetailsQuery();
  const { data: rentsList = [], isPending: loadingRents } =
    useGetMyRentsQuery();
  const { data: extendRent } = useMyRentDetailsQuery(frame?.rentId);
  const unpaidRent = findUnpaidRent(rentsList);
  const isNewRentFlow = !!frame && !frame.rentId && frame.step !== 'payment';

  useEffect(() => {
    if (!user || !isNewRentFlow || loadingRents || !unpaidRent) {
      return;
    }
    dispatch(showModal(<UnpaidRentModal rent={unpaidRent} />));
    history.replace(`/${UserService.getSlugByRole(user.role)}/main`);
  }, [dispatch, user, isNewRentFlow, loadingRents, unpaidRent]);

  const getTitle = () => {
    if (extendRent && extendRent.status === RentStatus.noPaidExtension)
      return 'application.debtPayOff';
    if (frame?.rentId) return 'application.extendsOrder';
    return 'application.newOrder';
  };

  if (isNewRentFlow && (loadingRents || unpaidRent)) {
    return null;
  }

  return (
    <OrderStepContext.Provider value={setFrame}>
      <PageHeader>{__(getTitle())}</PageHeader>
      {frame && <OrderProgress step={frame.step} />}
      {children}
    </OrderStepContext.Provider>
  );
};
