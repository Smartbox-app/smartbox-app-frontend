import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import ApiAccess from 'src/views/DashboardAdmin/Management/ApiAccess/ApiAccess';
import ClientsManagement from 'src/views/DashboardAdmin/Management/ClientsManagement';
import MobileAppsConfig from 'src/views/DashboardAdmin/Management/MobileAppsConfig/MobileAppsConfig';
import Settings from 'src/views/DashboardAdmin/Management/Settings';
import { AttachmentManagement } from 'src/views/DashboardCommon/AttachmentManagement';
import { CompaniesManagement } from 'src/views/DashboardCommon/CompanyManagement';
import { DocumentsManagement } from 'src/views/DashboardCommon/DocumentManagement';
import { InvitesSent } from 'src/views/DashboardCommon/InvitesSent';
import SMS from 'src/views/DashboardCommon/SMS';
import { SystemLogManagement } from 'src/views/DashboardCommon/SystemLogManagement';
import SystemNotificationManagement from 'src/views/DashboardCommon/SystemNotificationManagement';
import UsersManagement from 'src/views/DashboardCommon/UsersManagement';
import WorkersManagement from 'src/views/DashboardCommon/WorkersManagement';

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
