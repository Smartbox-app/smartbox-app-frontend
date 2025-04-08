import { ItfApiForm } from "itf_formbuilder_react";
import React from "react";
import { connect } from "react-redux";
import ReactCreatableSelect from "react-select/creatable";
import { bindActionCreators } from "redux";
import { modal, notifications } from "../../../../../actions";
import { Button, Spinner } from "../../../../../components/Branded";
import { ReactSelectOverride } from "../../../../../components/Common/ReactSelectOverride";
import {
  ButtonsContainer,
  FormContainer,
} from "../../../../../components/Layout";
import ApiService from "../../../../../services/api-service";
import { formOnTranslateString } from "../../../../../utils/trans-form";
import { mapFields } from "../../../../../utils/fields-mapper";
import { Header } from "src/components/ui";
import { __ } from "src/helpers/i18n";

interface Props {
  userId: string;
  successNotification: (text: string) => void;
  hideModal: () => void;
}

const EditAssign = ({ userId, successNotification, hideModal }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `user/form/update-worker-stocks/${userId}`;
  const sendUrl = "user/stocks";

  return (
    <>
      <Header variant='h1'>{__("application.workerAssignChange")}</Header>

      <FormContainer>
        <ItfApiForm
          formId="addOrderForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values: any) =>
            ApiService.sendForm(sendUrl, values, "PATCH")
          }
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            successNotification("notification.userAssigmentChanged");
            hideModal();
          }}
          onRenderFullField={mapFields}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{
            ReactSelect: ReactSelectOverride,
            ReactCreatableSelect,
          }}
        />
      </FormContainer>
    </>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ ...notifications, ...modal }, dispatch);

export default connect(null, mapDispatchToProps)(EditAssign);
