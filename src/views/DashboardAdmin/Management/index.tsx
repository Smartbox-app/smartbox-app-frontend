import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Section } from '../../../components/Layout';
import UserService from '../../../services/user-service';

import WorkersManagement from '../../DashboardCommon/WorkersManagement';
import UsersManagement from '../../DashboardCommon/UsersManagement';
import { AttachmentManagement } from '../../DashboardCommon/AttachmentManagement';

import { InvitesSent } from '../../DashboardCommon/InvitesSent';
import SMS from '../../DashboardCommon/SMS';
import Settings from './Settings';

import ClientsManagement from './ClientsManagement';
import { useGetMyDetailsQuery } from '../../../queries';
import { Tabs } from 'src/components/ui';
import {
  Adjustments,
  Boxes,
  Calendar,
  Invitations,
  List,
  Message,
  Stocks,
  Users,
  Workers,
} from 'src/icons';
import MobileAppsConfig from './MobileAppsConfig/MobileAppsConfig';
import SystemNotificationManagement from 'src/views/DashboardCommon/SystemNotificationManagement';
import { SystemLogManagement } from 'src/views/DashboardCommon/SystemLogManagement';
import { DocumentsManagement } from 'src/views/DashboardCommon/DocumentManagement';

const Management = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <>
      <Section>
        <Tabs
          tabs={[
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/users`,
              text: 'application.users',
              icon: <Users />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/workers`,
              text: 'application.workers',
              icon: <Workers />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/clients`,
              text: 'application.tenants',
              icon: <Stocks />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/invitations`,
              text: 'application.invitations',
              icon: <Invitations />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/sms`,
              text: 'application.smsNotifications',
              icon: <Message />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/settings`,
              text: 'application.settings',
              icon: <Adjustments />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/mobile-config`,
              text: 'application.mobileAppsConfig',
              icon: <Adjustments />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/attachments`,
              text: 'application.attachments',
              icon: <Boxes />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/documents`,
              text: 'application.documents',
              icon: <List />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/notifications`,
              text: 'application.systemNotifications',
              icon: <Calendar />,
            },
            {
              to: `/${UserService.getSlugByRole(user.role)}/management/system-logs`,
              text: 'application.systemLogs',
              icon: <List />,
            },
          ]}
        />
      </Section>
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
          path={`/${UserService.getSlugByRole(user.role)}/management/settings`}
          component={Settings}
        />
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/management/mobile-config`}
          component={MobileAppsConfig}
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
          path={`/${UserService.getSlugByRole(user.role)}/management/attachments`}
          component={AttachmentManagement}
        />
      </Switch>
    </>
  );
};

export default Management;
