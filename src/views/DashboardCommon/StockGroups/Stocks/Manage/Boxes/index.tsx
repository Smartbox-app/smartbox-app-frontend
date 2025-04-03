import React from "react";
import { Switch, Route, Redirect, useParams } from "react-router";
import { Add } from "./Add";
import { AddBatch } from "./AddBatch";
import { List } from "./List";
import UserService from "../../../../../../services/user-service";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../../../../../reducers";
import { Map } from "../Map";
import { UserRole } from "smartbox-types";

const Boxes = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const user = useSelector((state: ApplicationState) => state.user.details);

  if (!user) return null;

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  return (
    <Switch>
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes`}
        render={() => (
          <Redirect
            to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/boxes/list`}
          />
        )}
      />
      {hasFullAccess && (
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes/add`}
          component={Add}
        />
      )}
      {hasFullAccess && (
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes/add-multiple`}
          component={AddBatch}
        />
      )}
      {hasFullAccess && (
        <Route
          path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes/map`}
          component={Map}
        />
      )}
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/locations/stocks/:stockId/boxes/list`}
        component={List}
      />
    </Switch>
  );
};

export { Boxes };
