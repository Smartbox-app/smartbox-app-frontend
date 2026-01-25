import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AccessControl, StockRes, TenantEntity, UserRole } from 'smartbox-types';

import { Redirect, Route, Switch, useParams } from 'react-router';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { BasicData } from '../../../StockGroups/Stocks/Manage/BasicData';
import { Boxes } from './Boxes';
import { Rents } from './Rents';
import { Map } from './Map';
import { Groups } from './Groups';
import { Discounts } from './Discounts';
import ApiService from '../../../../../services/api-service';
import { Handling } from './Handling';
import { Gates } from './Gates';
import { Addons } from './Addons';
import { useGetMyDetailsQuery } from 'src/queries';
import { PageHeader, Section, Tabs } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
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
} from 'src/icons';
import GateStatus from 'src/views/DashboardCommon/GateStatus';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { Statistics } from './Statistics';
import { Alarms } from './Alarms';

const Manage = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();
  const tenant = useSelector((state: ApplicationState) => state.tenant);
  const { getText } = useTenantNaming();
  const [tenantForAdmin, setTenantForAdmin] = useState<TenantEntity>();
  const [isMapActive, setMapActive] = useState<boolean>(false);
  const [isAlarmsActive, setAlarmsActive] = useState<boolean>(false);

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  const getStockData = async () => {
    await ApiService.callFetch('GET', `stock/${stockId}`, (stock: StockRes) => {
      setMapActive(stock.isMapActive);
      setAlarmsActive(stock.accessControl === AccessControl.ksm);
      if (user?.role === UserRole.admin) getTenantForAdmin(stock.tenantId);
    });
  };

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
    getStockData();
  }, []);

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
    const elements = hasFullAccess
      ? [
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/data`,
            text: 'application.stockBasicData',
            icon: <InfoCircle />,
          },
          {
            to: `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/rents`,
            text: 'application.stockRents',
            icon: <ListIcon />,
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

    if (hasFullAccess && tenantForAdmin?.allowAddonsToRent) {
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
  }, [isMapActive, tenantForAdmin, hasFullAccess, isAlarmsActive]);

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
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/gates`}
            component={Gates}
          />
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/:stockId/alarms`}
            component={Alarms}
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
          {(tenantForAdmin?.allowAddonsToRent || tenant?.allowAddonsToRent) &&
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
