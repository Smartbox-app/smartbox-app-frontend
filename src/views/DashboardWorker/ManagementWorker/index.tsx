import { Redirect, Route, Switch } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { InvitesSent } from 'src/views/DashboardCommon/InvitesSent';
import UsersManagement from 'src/views/DashboardCommon/UsersManagement';

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
        path={`/${UserService.getSlugByRole(user.role)}/management/users`}
        component={UsersManagement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/management/invitations`}
        component={InvitesSent}
      />
    </Switch>
  );
};

export default Management;
