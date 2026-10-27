import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import ApiAccess from './ApiAccess/ApiAccess';
import ClientsManagement from './ClientsManagement';
import MobileAppsConfig from './MobileAppsConfig/MobileAppsConfig';
import Settings from './Settings';
import { AttachmentManagement } from '../../DashboardCommon/AttachmentManagement';
import { CompaniesManagement } from '../../DashboardCommon/CompanyManagement';
import { DocumentsManagement } from '../../DashboardCommon/DocumentManagement';
import { InvitesSent } from '../../DashboardCommon/InvitesSent';
import SMS from '../../DashboardCommon/SMS';
import { SystemLogManagement } from '../../DashboardCommon/SystemLogManagement';
import SystemNotificationManagement from '../../DashboardCommon/SystemNotificationManagement';
import UsersManagement from '../../DashboardCommon/UsersManagement';
import WorkersManagement from '../../DashboardCommon/WorkersManagement';

const Management = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/management`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/management/workers`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/workers`}
        component={WorkersManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/users`}
        component={UsersManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/clients`}
        component={ClientsManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/invitations`}
        component={InvitesSent}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/sms`}
        component={SMS}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/settings`}
        component={Settings}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/mobile-config`}
        component={MobileAppsConfig}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/api-access`}
        component={ApiAccess}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/notifications`}
        component={SystemNotificationManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/system-logs`}
        component={SystemLogManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/documents`}
        component={DocumentsManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/settlements`}
        component={CompaniesManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/companies`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/management/settlements`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/attachments`}
        component={AttachmentManagement}
      />
    </Switch>
  );
};

export default Management;
