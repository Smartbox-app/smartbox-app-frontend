import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Switch, Route, Redirect } from "react-router";
import { Tabs } from "../../../components/Branded";
import { Section } from "../../../components/Layout";
import { ApplicationState } from "../../../reducers";
import UserService from "../../../services/user-service";

import UsersManagement from "../../DashboardCommon/UsersManagement";
import { Settings } from "../Settings";
import InvitesSent from "../../DashboardCommon/InvitesSent";
import ApiService from "../../../services/api-service";
import SMS from "../../DashboardCommon/SMS";
import { TemplatesManagement } from "../Templates";
import WorkersManagement from "../../DashboardCommon/WorkersManagement";

const Management = () => {
  const user = useSelector((state: ApplicationState) => state.user.details!);
  const tenant = useSelector((state: ApplicationState) => state.tenant);

  const [smsStatus, setSmsStatus] = useState<boolean>();

  const getStatus = async () => {
    if (!tenant) return;
    ApiService.callFetch(
      "GET",
      `tenant/sms-service-status/${tenant.id}`,
      (response: boolean) => setSmsStatus(response)
    );
  };

  useEffect(() => {
    getStatus();
  }, []);

  const getTabs = () => {
    const tabs = [
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/users/list`,
        text: "application.users",
      },
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/workers`,
        text: "application.workers",
      },
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/invitations`,
        text: "application.invitations",
      },
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/settings`,
        text: "application.settings",
      },
      {
        to: `/${UserService.getSlugByRole(user.role)}/management/templates`,
        text: "application.templates",
      },
    ];

    if (smsStatus) {
      tabs.push({
        to: `/${UserService.getSlugByRole(user.role)}/management/sms`,
        text: "application.sendSms",
      });
    }

    return tabs;
  };
  return (
    <Section full>
      <Tabs tabs={getTabs()} />

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
      </Switch>
    </Section>
  );
};

export default Management;
