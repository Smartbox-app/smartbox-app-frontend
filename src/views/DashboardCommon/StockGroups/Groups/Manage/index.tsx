import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import {
  PageHeader,
  ButtonsContainer,
  Section,
} from "../../../../../components/Layout";
import { Button, Tabs } from "../../../../../components/Branded";
import { Redirect, Route, Switch, useParams } from "react-router";
import UserService from "../../../../../services/user-service";
import { ApplicationState } from "../../../../../reducers";
import { BasicData } from "./BasicData";
import { Gates } from "./Gates";
import { UserRole } from "smartbox-types";

const ManageGroup = () => {
  const { stockGroupId } = useParams<{ stockGroupId: string }>();
  const user = useSelector((state: ApplicationState) => state.user.details);

  const hasFullAccess = [UserRole.admin, UserRole.client].includes(user!.role);

  const tabs = useMemo(() => {
    const basicElements = [
      {
        to: `/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates`,
        text: "application.gates",
      },
    ];

    if (!hasFullAccess) return basicElements;

    return [
      {
        to: `/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/data`,
        text: "application.stockGroupBasicData",
      },
      ...basicElements,
    ];
  }, []);

  return (
    <Section>
      <PageHeader title="application.stockManage" />
      <ButtonsContainer>
        <Button to="/admin/locations/groups" text="application.back" primary />
      </ButtonsContainer>

      <Tabs tabs={tabs} />

      <Switch>
        <Route
          exact
          path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId`}
          render={() =>
            hasFullAccess ? (
              <Redirect
                to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/data`}
              />
            ) : (
              <Redirect
                to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates`}
              />
            )
          }
        />
        {hasFullAccess && (
          <Route
            exact
            path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId/data`}
            component={BasicData}
          />
        )}
        <Route
          path={`/${UserService.getSlugByRole(user!.role)}/locations/groups/:stockGroupId/gates`}
          component={Gates}
        />
      </Switch>
    </Section>
  );
};

export { ManageGroup };
