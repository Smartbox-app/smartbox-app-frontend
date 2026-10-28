import { useEffect, useState, useMemo } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';

import { AccessControl, TenantEntity, UserRole } from 'smartbox-types';
import { PageHeader, Section, Tabs } from 'src/components/ui';
import { useTenant } from 'src/hooks/useTenant';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import {
  InfoCircle,
  List as ListIcon,
  Stop,
  Boxes as BoxesIcon,
  Groups as GroupsIcon,
  Percentage,
  HomeWifi,
  Add,
  Map as MapIcon,
  Adjustments,
  Error,
  Wallet,
  Users,
  Settings,
} from 'src/icons';
import { useGetMyDetailsQuery, useGetStockQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import UserService from 'src/services/user-service';

import GateStatus from '../../../GateStatus';
import { Addons } from './Addons';
import { StockAgreements } from './Agreements';
import { Alarms } from './Alarms';
import { BasicData } from './BasicData';
import { Boxes } from './Boxes';
import { Diagnostics } from './Diagnostics';
import { Discounts } from './Discounts';
import { Gates } from './Gates';
import { Groups } from './Groups';
import { Handling } from './Handling';
import { Map } from './Map';
import { Payments } from './Payments';
import { RentAuthorizationsList } from './RentAuthorizations';
import { Rents } from './Rents';
import { Statistics } from './Statistics';

const publicTenantAllowsAddons = (tenant: object | null | undefined) =>
  Boolean(
    tenant &&
      'allowAddonsToRent' in tenant &&
      (tenant as { allowAddonsToRent?: boolean }).allowAddonsToRent,
  );

const Manage = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();
  const { tenant } = useTenant();
  const { getText } = useTenantNaming();
  const [tenantForAdmin, setTenantForAdmin] = useState<TenantEntity>();
  const [isMapActive, setMapActive] = useState<boolean>(false);
  const [isAlarmsActive, setAlarmsActive] = useState<boolean>(false);

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  const { data: stockData } = useGetStockQuery(stockId);

  const getTenantForAdmin = async (tenantId: string) => {
    await ApiService.callFetch(
      'GET',
      `tenant/admin/${tenantId}`,
      (tenant: TenantEntity) => {
        setTenantForAdmin(tenant);
      },
    );
  };

  useEffect(() => {
    if (!stockData) return;

    setMapActive(stockData.isMapActive);
    setAlarmsActive(stockData.gateAccessControl === AccessControl.ksm);
    if (user?.role === UserRole.admin && stockData.tenantId) {
      getTenantForAdmin(stockData.tenantId);
    }
  }, [stockData, user?.role]);

  const tabs = useMemo(() => {
    const gatesAndAlarms = [
      {
        to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/gates`,
        text: 'application.gates',
        icon: <Stop />,
      },
    ];
    if (isAlarmsActive) {
      gatesAndAlarms.push({
        to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/alarms`,
        text: 'application.alarms',
        icon: <Error />,
      });
    }
    gatesAndAlarms.push({
      to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/diagnostics`,
      text: 'application.diagnostics',
      icon: <HomeWifi />,
    });
    const elements = hasFullAccess
      ? [
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/data`,
            text: 'application.stockBasicData',
            icon: <InfoCircle />,
          },
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/agreements`,
            text: 'application.stockAgreements',
            icon: <Settings />,
          },
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/rents`,
            text: 'application.stockRents',
            icon: <ListIcon />,
          },
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/authorizations`,
            text: 'application.stockRentAuthorizationsTab',
            icon: <Users />,
          },
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/payments`,
            text: 'application.payments',
            icon: <Wallet />,
          },
          ...gatesAndAlarms,
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/groups`,
            text: getText('boxes_groups'),
            icon: <GroupsIcon />,
          },
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/discounts`,
            text: 'application.stockSale',
            icon: <Percentage />,
          },
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/boxes`,
            text: getText('boxes'),
            icon: <BoxesIcon />,
          },
        ]
      : [
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/rents`,
            text: 'application.stockRents',
            icon: <ListIcon />,
          },
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/authorizations`,
            text: 'application.stockRentAuthorizationsTab',
            icon: <Users />,
          },
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/payments`,
            text: 'application.payments',
            icon: <Wallet />,
          },
          ...gatesAndAlarms,
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/boxes`,
            text: 'application.stockBoxes',
            icon: <BoxesIcon />,
          },
        ];

    if (isMapActive) {
      if (hasFullAccess) {
        elements.push({
          to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/map`,
          text: 'application.map',
          icon: <MapIcon />,
        });
      }
      elements.push({
        to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/handling`,
        text: getText('handling'),
        icon: <HomeWifi />,
      });
    }

    if (
      hasFullAccess &&
      (tenantForAdmin?.allowAddonsToRent || publicTenantAllowsAddons(tenant))
    ) {
      elements.push({
        to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/addons`,
        text: 'application.stockAddons',
        icon: <Add />,
      });
    }

    elements.push({
      to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/statistics`,
      text: getText('stats'),
      icon: <Adjustments />,
    });

    return elements;
  }, [
    isMapActive,
    tenant,
    tenantForAdmin,
    hasFullAccess,
    isAlarmsActive,
    stockId,
    user,
    getText,
  ]);

  return (
    <>
      <PageHeader>{getText('manage')}</PageHeader>
      <GateStatus stockId={stockId} />
      <Section>
        <Tabs tabs={tabs} />
      </Section>
      <>
        <Switch>
          <Route
            exact
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId`}
            render={() =>
              hasFullAccess ? (
                <Redirect
                  to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/data`}
                />
              ) : (
                <Redirect
                  to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/rents`}
                />
              )
            }
          />
          {hasFullAccess && (
            <Route
              exact
              path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/data`}
              component={BasicData}
            />
          )}
          {hasFullAccess && (
            <Route
              exact
              path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/agreements`}
              component={StockAgreements}
            />
          )}
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/gates`}
            component={Gates}
          />
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/alarms`}
            component={Alarms}
          />
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/diagnostics`}
            component={Diagnostics}
          />
          {hasFullAccess && (
            <Route
              path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/settings`}
              component={BasicData}
            />
          )}

          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/boxes`}
            component={Boxes}
          />
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/rents`}
            component={Rents}
          />
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/authorizations`}
            component={RentAuthorizationsList}
          />
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/payments`}
            component={Payments}
          />
          {hasFullAccess && (
            <Route
              path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/groups`}
              component={Groups}
            />
          )}
          {hasFullAccess && (
            <Route
              path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/discounts`}
              component={Discounts}
            />
          )}
          {hasFullAccess && (
            <Route
              path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/addons`}
              component={Addons}
            />
          )}
          {isMapActive && hasFullAccess && (
            <Route
              path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/map`}
              component={Map}
            />
          )}
          {isMapActive && (
            <Route
              path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/handling`}
              component={Handling}
            />
          )}
          {(tenantForAdmin?.allowAddonsToRent ||
            publicTenantAllowsAddons(tenant)) &&
            hasFullAccess && (
              <Route
                path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/addons`}
                component={Addons}
              />
            )}
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/statistics`}
            component={Statistics}
          />
        </Switch>
      </>
    </>
  );
};

export { Manage };
