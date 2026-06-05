import { Redirect, Route, Switch } from 'react-router';

import UserService from '../../../services/user-service';
import UsersManagement from '../../../views/DashboardCommon/UsersManagement';
import { InvitesSent } from '../../../views/DashboardCommon/InvitesSent';
import { useGetMyDetailsQuery } from 'src/queries';

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
