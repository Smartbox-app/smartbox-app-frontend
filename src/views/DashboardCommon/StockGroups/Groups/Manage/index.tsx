import { useMemo } from 'react';

import { Redirect, Route, Switch, useParams } from 'react-router';
import UserService from '../../../../../services/user-service';
import { BasicData } from './BasicData';
import { Gates } from './Gates';
import { UserRole } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries';
import { PageHeader, Section, Tabs } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { InfoCircle, Stop } from 'src/icons';
import GateStatus from 'src/views/DashboardCommon/GateStatus';

const ManageGroup = () => {
  const { stockGroupId } = useParams<{ stockGroupId: string }>();
  const { data: user } = useGetMyDetailsQuery();

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  const tabs = useMemo(() => {
    const basicElements = [
      {
        to: `/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates`,
        text: 'application.gates',
        icon: <Stop />,
      },
    ];

    if (!hasFullAccess) return basicElements;

    return [
      {
        to: `/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/data`,
        text: 'application.stockGroupBasicData',
        icon: <InfoCircle />,
      },
      ...basicElements,
    ];
  }, []);

  return (
    <>
      <PageHeader>{__('application.stockManage')}</PageHeader>
      <GateStatus stockGroupId={stockGroupId} />
      <Section>
        <Tabs tabs={tabs} />
      </Section>
      <>
        <Switch>
          <Route
            exact
            path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId`}
            render={() =>
              hasFullAccess ? (
                <Redirect
                  to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/data`}
                />
              ) : (
                <Redirect
                  to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates`}
                />
              )
            }
          />
          {hasFullAccess && (
            <Route
              exact
              path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId/data`}
              component={BasicData}
            />
          )}
          <Route
            path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId/gates`}
            component={Gates}
          />
        </Switch>
      </>
    </>
  );
};

export { ManageGroup };
