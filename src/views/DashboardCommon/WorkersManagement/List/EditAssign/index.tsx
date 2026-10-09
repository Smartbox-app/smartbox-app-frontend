import { ItfApiForm } from "itf_formbuilder_react";
import React from "react";
import { useDispatch } from "react-redux";
import { Button, Spinner } from "../../../../../components/Branded";
import { ButtonsContainer } from "../../../../../components/Layout";
import ApiService from "../../../../../services/api-service";
import { formOnTranslateString } from "../../../../../utils/trans-form";
import { mapFields } from "../../../../../utils/fields-mapper";
import { Modal } from "src/components/ui";
import { __ } from "src/helpers/i18n";
import { UpdateWorkerStocksReq } from "smartbox-types";
import { hideModal } from "src/actions/modal";
import { successNotification } from "src/actions/notifications";

interface Props {
  userId: string;
}

const EditAssign = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `user/form/update-worker-stocks/${userId}`;
  const sendUrl = "user/stocks";

  return (
    <>
      <Modal.Header title={__("application.workerAssignChange")} />
      <Modal.Content>
        <ItfApiForm
          formId="addOrderForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(_formId: string, values: UpdateWorkerStocksReq) =>
            ApiService.sendForm(sendUrl, values, "PATCH")
          }
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            dispatch(successNotification("notification.userAssigmentChanged"));
            dispatch(hideModal());
          }}
          onRenderFullField={mapFields}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{
            // ReactSelect: ReactSelectOverride,
            // ReactCreatableSelect,
          }}
        />
      </Modal.Content>
    </>
  );
};

export default EditAssign;
