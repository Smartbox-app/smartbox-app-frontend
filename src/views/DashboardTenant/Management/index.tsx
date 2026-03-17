import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { ApplicationState } from '../../../reducers';
import UserService from '../../../services/user-service';

import UsersManagement from '../../DashboardCommon/UsersManagement';
import { Settings } from '../Settings';
import InvitesSent from '../../DashboardCommon/InvitesSent';
import ApiService from '../../../services/api-service';
import SMS from '../../DashboardCommon/SMS';
import { TemplatesManagement } from '../Templates';
import WorkersManagement from '../../DashboardCommon/WorkersManagement';
import { useGetMyDetailsQuery } from 'src/queries';
import { SingleTab } from 'src/types/tab';
import {
  Adjustments,
  Boxes,
  Calendar,
  Invitations,
  List,
  Message,
  Templates,
  Users,
  Wallet,
  Workers,
} from 'src/icons';
import { Section, Tabs } from 'src/components/ui';
import { AttachmentManagement } from 'src/views/DashboardCommon/AttachmentManagement';
import SystemNotificationManagement from 'src/views/DashboardCommon/SystemNotificationManagement';
import { DocumentsManagement } from 'src/views/DashboardCommon/DocumentManagement';

const Management = () => {
  const { data: user } = useGetMyDetailsQuery();
  const tenant = useSelector((state: ApplicationState) => state.tenant);

  const [smsStatus, setSmsStatus] = useState<boolean>();

  const getStatus = async () => {
    if (!tenant) return;
    ApiService.callFetch(
      'GET',
      `tenant/sms-service-status/${tenant.id}`,
      (response: boolean) => setSmsStatus(response),
    );
  };

  useEffect(() => {
    getStatus();
  }, []);

  if (!user) return null;

  const getTabs = () => {
    const tabs: SingleTab[] = [
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/users/list`,
        text: 'application.users',
        icon: <Users />,
      },
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/workers`,
        text: 'application.workers',
        icon: <Workers />,
      },
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/invitations`,
        text: 'application.invitations',
        icon: <Invitations />,
      },
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/settings`,
        text: 'application.settings',
        icon: <Adjustments />,
      },
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/templates`,
        text: 'application.templates',
        icon: <Templates />,
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
    ];

    if (smsStatus) {
      tabs.push({
        to: `/${UserService.getSlugByRole(user.role)}/management/sms`,
        text: 'application.sendSms',
        icon: <Message />,
      });
    }

    return tabs;
  };
  return (
    <>
      <Section>
        <Tabs tabs={getTabs()} />
      </Section>

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
          path={`/${UserService.getSlugByRole(user.role)}/management/settings`}
          component={Settings}
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
          path={`/${UserService.getSlugByRole(user.role)}/management/attachments`}
          component={AttachmentManagement}
        />
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/management/documents`}
          component={DocumentsManagement}
        />
      </Switch>
    </>
  );
};

export default Management;
