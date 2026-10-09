import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { ItfApiForm } from "itf_formbuilder_react";
import { AddInvitedUserReq } from "smartbox-types";
import { successNotification } from "../../../actions/notifications";
import ApiService from "../../../services/api-service";

import { Spinner, Button, PageContent , Logo } from "../../../components/Branded";
import { formOnTranslateString } from "../../../utils/trans-form";
import {
  FormContainer,
  ButtonsContainer,
  PageHeader,
} from "../../../components/Layout";
import { history } from 'src/history';
import { __ } from "../../../helpers/i18n";
import { mapFieldsBig } from "../../../utils/fields-mapper";

const UserActivation = () => {
  const dispatch = useDispatch();
  const { invitationId, updateToken } = useParams<{
    invitationId: string;
    updateToken: string;
  }>();
  const loadUrl = "user/form/add-invited-user";
  const sendUrl = "user/add-invited";

  const customSendFetcher = (formId: string, values: AddInvitedUserReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        invitationId,
        token: updateToken,
      },
      "POST"
    );

  const success = () => {
    dispatch(successNotification("notification.accountHasBeenActivated"));
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

export default UserActivation;
