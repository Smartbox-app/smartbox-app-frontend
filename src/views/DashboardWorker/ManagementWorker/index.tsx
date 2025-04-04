import { Redirect, Route, Switch } from 'react-router';
import { Tabs } from '../../../components/Branded';
import { Section } from '../../../components/Layout';
import UserService from '../../../services/user-service';
import UsersManagement from '../../../views/DashboardCommon/UsersManagement';
import InvitesSent from '../../../views/DashboardCommon/InvitesSent';
import { useGetMyDetailsQuery } from 'src/queries';

const Management = () => {
  const { data: user } = useGetMyDetailsQuery();
  const getTabs = () => {
    const tabs = [
      {
        to: `/${UserService.getSlugByRole(user!.role)}/management/users/list`,
        text: 'application.users',
      },
      {
        to: `/${UserService.getSlugByRole(user!.role)}/management/invitations`,
        text: 'application.invitations',
      },
    ];

    return tabs;
  };

  return (
    <Section full>
      <Tabs tabs={getTabs()} />

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
    </Section>
  );
};

export default Management;
