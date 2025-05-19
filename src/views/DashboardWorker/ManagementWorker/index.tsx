import { Redirect, Route, Switch } from 'react-router';

import UserService from '../../../services/user-service';
import UsersManagement from '../../../views/DashboardCommon/UsersManagement';
import InvitesSent from '../../../views/DashboardCommon/InvitesSent';
import { useGetMyDetailsQuery } from 'src/queries';
import { Section, Tabs } from 'src/components/ui';
import { SingleTab } from 'src/types/tab';
import { Invitations, Users } from 'src/icons';

const Management = () => {
  const { data: user } = useGetMyDetailsQuery();

  const tabs: SingleTab[] = [
    {
      to: `/${UserService.getSlugByRole(user!.role)}/management/users/list`,
      text: 'application.users',
      icon: <Users />,
    },
    {
      to: `/${UserService.getSlugByRole(user!.role)}/management/invitations`,
      text: 'application.invitations',
      icon: <Invitations />,
    },
  ];

  return (
    <>
      <Section>
        <Tabs tabs={tabs} />
      </Section>
      <Switch>
        <Route
          exact
          path={`/${UserService.getSlugByRole(user!.role)}/management`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user!.role)}/management/users`}
            />
          )}
        />
        <Route
          path={`/${UserService.getSlugByRole(user!.role)}/management/users`}
          component={UsersManagement}
        />
        <Route
          path={`/${UserService.getSlugByRole(user!.role)}/management/invitations`}
          component={InvitesSent}
        />
      </Switch>
    </>
  );
};

export default Management;
