import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import UserService from '../../../services/user-service';

import UsersManagement from '../../DashboardCommon/UsersManagement';
import { Settings } from '../Settings';
import { InvitesSent } from '../../DashboardCommon/InvitesSent';
import SMS from '../../DashboardCommon/SMS';
import { TemplatesManagement } from '../Templates';
import WorkersManagement from '../../DashboardCommon/WorkersManagement';
import { useGetMyDetailsQuery } from 'src/queries';
import { AttachmentManagement } from 'src/views/DashboardCommon/AttachmentManagement';
import SystemNotificationManagement from 'src/views/DashboardCommon/SystemNotificationManagement';
import { DocumentsManagement } from 'src/views/DashboardCommon/DocumentManagement';
import { SystemLogManagement } from 'src/views/DashboardCommon/SystemLogManagement';
import { CompaniesManagement } from 'src/views/DashboardCommon/CompanyManagement';
import { TenantApiAccess } from '../ApiAccess';

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
