import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import UserService from '../../../services/user-service';

import WorkersManagement from '../../DashboardCommon/WorkersManagement';
import UsersManagement from '../../DashboardCommon/UsersManagement';
import { AttachmentManagement } from '../../DashboardCommon/AttachmentManagement';
import { InvitesSent } from '../../DashboardCommon/InvitesSent';
import SMS from '../../DashboardCommon/SMS';
import Settings from './Settings';
import ClientsManagement from './ClientsManagement';
import { useGetMyDetailsQuery } from '../../../queries';
import MobileAppsConfig from './MobileAppsConfig/MobileAppsConfig';
import ApiAccess from './ApiAccess/ApiAccess';
import SystemNotificationManagement from 'src/views/DashboardCommon/SystemNotificationManagement';
import { SystemLogManagement } from 'src/views/DashboardCommon/SystemLogManagement';
import { DocumentsManagement } from 'src/views/DashboardCommon/DocumentManagement';
import { CompaniesManagement } from 'src/views/DashboardCommon/CompanyManagement';

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
