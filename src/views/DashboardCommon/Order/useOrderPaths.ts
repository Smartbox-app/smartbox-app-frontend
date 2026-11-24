import { useCallback } from 'react';

import { UserRole } from 'smartbox-types';

import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

type NamedOrderStep = 'duration' | 'summary' | 'agreement';

type NewRentTarget = {
  stockId: string;
  boxGroupId: string;
};

type ExtensionTarget = {
  rentId: string;
};

type OrderTarget = NewRentTarget | ExtensionTarget;

const isExtension = (target: OrderTarget): target is ExtensionTarget =>
  'rentId' in target;

const orderBasePath = (role: UserRole) =>
  `/${UserService.getSlugByRole(role)}/order`;

const orderRoutes = (role: UserRole) => {
  const base = orderBasePath(role);
  return {
    stock: base,
    extensionDuration: `${base}/rent/:rentId/duration`,
    extensionSummary: `${base}/rent/:rentId/summary`,
    extensionAgreement: `${base}/rent/:rentId/agreement`,
    extensionPayment: `${base}/rent/:rentId/payment/:paymentId`,
    duration: `${base}/:stockId/:boxGroupId/duration`,
    summary: `${base}/:stockId/:boxGroupId/summary`,
    agreement: `${base}/:stockId/:boxGroupId/agreement`,
    payment: `${base}/:stockId/:boxGroupId/payment/:paymentId`,
    size: `${base}/:stockId`,
  };
};

const stepPath = (role: UserRole, step: NamedOrderStep, target: OrderTarget) => {
  const base = orderBasePath(role);
  if (isExtension(target)) return `${base}/rent/${target.rentId}/${step}`;
  return `${base}/${target.stockId}/${target.boxGroupId}/${step}`;
};

export const useOrderPaths = () => {
  const { data: user } = useGetMyDetailsQuery();
  const role = user?.role;

  const go = useCallback((path: string | undefined) => {
    if (!path) return;
    history.push(path);
  }, []);

  const goToStockSelect = useCallback(
    (stockId?: string) => {
      if (!role) return;
      const query = stockId
        ? `?${new URLSearchParams({ stock: stockId }).toString()}`
        : '';
      go(`${orderBasePath(role)}${query}`);
    },
    [go, role],
  );

  const goToSize = useCallback(
    (stockId: string, boxGroupId?: string) => {
      if (!role) return;
      const query = boxGroupId
        ? `?${new URLSearchParams({ group: boxGroupId }).toString()}`
        : '';
      go(`${orderBasePath(role)}/${stockId}${query}`);
    },
    [go, role],
  );

  const goToStep = useCallback(
    (step: NamedOrderStep, target: OrderTarget) => {
      if (!role) return;
      go(stepPath(role, step, target));
    },
    [go, role],
  );

  const goToDuration = useCallback(
    (target: OrderTarget) => goToStep('duration', target),
    [goToStep],
  );

  const goToSummary = useCallback(
    (target: OrderTarget) => goToStep('summary', target),
    [goToStep],
  );

  const goToAgreement = useCallback(
    (target: OrderTarget) => goToStep('agreement', target),
    [goToStep],
  );

  return {
    routes: role ? orderRoutes(role) : null,
    goToStockSelect,
    goToSize,
    goToDuration,
    goToSummary,
    goToAgreement,
  };
};
