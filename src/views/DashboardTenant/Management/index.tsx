import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { AttachmentManagement } from 'src/views/DashboardCommon/AttachmentManagement';
import { CompaniesManagement } from 'src/views/DashboardCommon/CompanyManagement';
import { DocumentsManagement } from 'src/views/DashboardCommon/DocumentManagement';
import { InvitesSent } from 'src/views/DashboardCommon/InvitesSent';
import SMS from 'src/views/DashboardCommon/SMS';
import { SystemLogManagement } from 'src/views/DashboardCommon/SystemLogManagement';
import SystemNotificationManagement from 'src/views/DashboardCommon/SystemNotificationManagement';
import UsersManagement from 'src/views/DashboardCommon/UsersManagement';
import WorkersManagement from 'src/views/DashboardCommon/WorkersManagement';
import { TenantApiAccess } from 'src/views/DashboardTenant/ApiAccess';
import { Settings } from 'src/views/DashboardTenant/Settings';
import { TemplatesManagement } from 'src/views/DashboardTenant/Templates';

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
            to={`/${UserService.getSlugByRole(user.role)}/management/users`}
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
        path={`/${UserService.getSlugByRole(user.role)}/management/settlements`}
        component={CompaniesManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/settings`}
        component={Settings}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/api-access`}
        component={TenantApiAccess}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/invitations`}
        component={InvitesSent}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/templates`}
        component={TemplatesManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/sms`}
        component={SMS}
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
        path={`/${UserService.getSlugByRole(user.role)}/management/attachments`}
        component={AttachmentManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/documents`}
        component={DocumentsManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/companies`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/management/settlements`}
          />
        )}
      />
    </Switch>
  );
};

export default Management;
