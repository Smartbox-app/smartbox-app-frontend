import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { ItfApiForm } from "itf_formbuilder_react";
import { AddInvitedUserReq, UserRes } from "smartbox-types";
import { notifications, auth } from "../../../actions";
import ApiService from "../../../services/api-service";

import { Spinner, Button, PageContent } from "../../../components/Branded";
import { Logo } from "../../../components/Branded";
import { formOnTranslateString } from "../../../utils/trans-form";
import {
  FormContainer,
  ButtonsContainer,
  PageHeader,
} from "../../../components/Layout";
import { history } from "../../../App";
import { __ } from "../../../helpers/i18n";
import { mapFieldsBig } from "../../../utils/fields-mapper";

interface Props {
  match: any;
  userRole: UserRes;
  logout: () => void;
  successNotification: (text: string) => void;
}

const UserActivation = ({ successNotification, match }: Props) => {
  const loadUrl = "user/form/add-invited-user";
  const sendUrl = "user/add-invited";

  const customSendFetcher = (formId: string, values: AddInvitedUserReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        invitationId: match.params.invitationId,
        token: match.params.updateToken,
      },
      "POST"
    );

  const success = () => {
    successNotification("notification.accountHasBeenActivated");
    history.push("/");
  };

  const subButton = (
    <ButtonsContainer max>
      <Button text="application.send" type="submit" big primary rounded />
    </ButtonsContainer>
  );

  return (
    <PageContent>
      <div className="login-logo-wrapper">
        <Logo />
      </div>
      <FormContainer className="login-form">
        <PageHeader title="application.welcomeOnPlatform" />
        <p>{__("application.fillFormToCreateAccount")}</p>
        <ItfApiForm
          formId="UserActivationForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(loadUrl)}
          sendFetcher={customSendFetcher}
          submitButton={subButton}
          onSavedSuccessfully={success}
          onRenderFullField={mapFieldsBig}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </PageContent>
  );
};

const mapDispatchToProps = (dispatch: any): any =>
  bindActionCreators(
    {
      ...notifications,
      ...auth,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(UserActivation);
