import { Switch, Route, Redirect } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { Detail } from './Detail';

const Profile = () => {
  const { data: user } = useGetMyDetailsQuery();
  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user!.role)}/profile`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user!.role)}/profile/detail`}
          />
        )}
      />
      <Route
        path={`/${UserService.getSlugByRole(user!.role)}/profile/detail`}
        component={Detail}
      />
    </Switch>
  );
};

export default Profile;
