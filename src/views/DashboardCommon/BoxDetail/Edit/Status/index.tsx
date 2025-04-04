import React from "react";
import { ItfApiForm } from "itf_formbuilder_react";
import { connect, useDispatch } from "react-redux";
import ReactCreatableSelect from "react-select/creatable";
import { bindActionCreators } from "redux";
import { ChangeStatusReq, StockList } from "smartbox-types";
import { boxes, modal, notifications, stock } from "../../../../../actions";
import {
  FormContainer,
  ButtonsContainer,
} from "../../../../../components/Layout";
import { Alert } from "../../../../../components/Common";
import { Button, Spinner } from "../../../../../components/Branded";
import { ApplicationState } from "../../../../../reducers";
import ApiService from "../../../../../services/api-service";
import { formOnTranslateString } from "../../../../../utils/trans-form";

import "./Status.scss";
import { ReactSelectOverride } from "../../../../../components/Common/ReactSelectOverride";
import { refreshApiTableData } from "../../../../../actions/api-table";
import { mapFields } from "../../../../../utils/fields-mapper";

interface Props {
  selectedBoxId: string;
  stockId: string;
  hideModal: () => void;
  successNotification: (text: string) => void;
  showModal: (content: React.ReactNode) => void;
  rentId?: string;
  callback?: () => void;
}

const Status = ({
  selectedBoxId,
  hideModal,
  successNotification,
  stockId,
  rentId,
  showModal,
  callback,
}: Props) => {
  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.changeStatus" type="submit" danger />
    </ButtonsContainer>
  );

  if (!stock) return null;

  const fetchUrl = `rent/form/change-status/${rentId || ""}`;
  const sendUrl = `rent/status/${stockId}/${rentId || ""}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) => {
    showModal(
      <>
        {values.status === null || values.status.length === 0 ? (
          <Alert type="error" text="application.notChooseStatus" />
        ) : (
          <div className="modal-alert-wrapper">
            <Alert
              type="warning"
              text="application.userWillNotGetMailWithInformation"
            />
            <Alert type="notice" text="application.actionCanNotBeUnDone" />
          </div>
        )}

        <ButtonsContainer>
          <Button text="application.cancel" danger click={() => hideModal()} />
          <Button
            success
            type="submit"
            text="application.understood"
            disabled={values.status === null || values.status.length === 0}
            click={async () => {
              await hideModal();
              await ApiService.sendForm(
                sendUrl,
                {
                  ...values,
                  boxId: selectedBoxId,
                } as ChangeStatusReq,
                "PATCH"
              );
              await successNotification("notification.userStatusChanged");
              dispatch(refreshApiTableData());
              if (callback) callback();
            }}
          />
        </ButtonsContainer>
      </>
    );
  };

  return (
    <FormContainer className="box-status-form">
      <ItfApiForm
        formId="box-status-form"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        loadingInfo={<Spinner transparent />}
        onTranslateString={formOnTranslateString}
        onRenderFullField={mapFields}
        thirdPartyComponents={{
          ReactSelect: ReactSelectOverride,
          ReactCreatableSelect,
        }}
      />
      <p>
        Skrytku posiadające nieopłacone przedłużenie nie mogą być bezpośrednio
        zwolnione ani wyłączone z użytku - najpierw należy zweryfikować kwestię
        wynajmu.
      </p>
    </FormContainer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  stocks: state.stock.list,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    { ...stock, ...modal, ...notifications, ...boxes },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Status);
