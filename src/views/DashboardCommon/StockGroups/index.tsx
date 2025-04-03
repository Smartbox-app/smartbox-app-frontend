import React from "react";
import { Redirect, Route, Switch } from "react-router";
import UserService from "../../../services/user-service";
import { Tabs } from "../../../components/Branded";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../../reducers";
import { Add } from "./Stocks/Add";
import { List } from "./Stocks/List";
import { Manage } from "./Stocks/Manage";
import { Section } from "../../../components/Layout";
import { GroupsList } from "./Groups/List";
import { Add as AddGroup } from "./Groups/Add";
import { ManageGroup } from "./Groups/Manage";
import { UserRole } from "smartbox-types";

const StockGroups = () => {
  const user = useSelector((state: ApplicationState) => state.user.details!);
  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user.role);

  return (
    <Section full>
      <Tabs
        tabs={[
          {
            to: `/${UserService.getSlugByRole(user.role)}/locations/stocks`,
            text: "application.stocks",
          },
          {
            to: `/${UserService.getSlugByRole(user.role)}/locations/groups`,
            text: "application.stockGroups",
          },
        ]}
      />
      <Switch>
        <Route
          exact
          path={`/${UserService.getSlugByRole(user.role)}/locations`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user.role)}/locations/stocks`}
            />
          )}
        />
        <Route
          exact
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/list`}
            />
          )}
        />
        <Route
          exact
          path={`/${UserService.getSlugByRole(user.role)}/locations/groups`}
          render={() => (
            <Redirect
              to={`/${UserService.getSlugByRole(user.role)}/locations/groups/list`}
            />
          )}
        />
        {hasFullAccess && (
          <Route
            path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/add`}
            component={Add}
          />
        )}
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/list`}
          component={List}
        />
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/groups/list`}
          component={GroupsList}
        />
        {hasFullAccess && (
          <Route
            path={`/${UserService.getSlugByRole(user.role)}/locations/groups/add`}
            component={AddGroup}
          />
        )}
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/groups/:stockGroupId`}
          component={ManageGroup}
        />
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId`}
          component={Manage}
        />
      </Switch>
    </Section>
  );
};

export { StockGroups };
