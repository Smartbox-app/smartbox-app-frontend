import React from "react";
import { ItfApiForm } from "itf_formbuilder_react";
import { UserRole } from "smartbox-types";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner } from "../../../../../components/Branded";
import { ButtonsContainer, Section } from "../../../../../components/Layout";
import ApiService from "../../../../../services/api-service";
import { formOnTranslateString } from "../../../../../utils/trans-form";
import { ApplicationState } from "../../../../../reducers";
import { successNotification } from "../../../../../actions/notifications";
import { __ } from "../../../../../helpers/i18n";
import { mapFields } from "../../../../../utils/fields-mapper";
import { getTenantById } from "../../../../../actions/tenant";
import { useTenant } from "../../../../../hooks/useTenant";
import { useGetMyDetailsQuery } from "../../../../../queries";

interface Props {
  userId?: string;
}

const ManageTenantAdminData = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();
  const { data: user } = useGetMyDetailsQuery();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  if (!user) return null;

  const fetchUrl =
    user.role === UserRole.admin && userId
      ? `tenant/form/admin-data/${userId}`
      : "tenant/form/data";
  const sendUrl =
    user.role === UserRole.admin && userId
      ? `tenant/admin/data/${userId}`
      : "tenant/data";

  const customSendFetcher = (formId: string, values) => {
    return ApiService.sendForm(sendUrl, values, "PATCH");
  };

  return (
    <Section highlight>
      <ItfApiForm
        formId="tenantDataForm"
        schemaMayBeDynamic={true}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onRenderFullField={mapFields}
        onSavedSuccessfully={() => {
          dispatch(successNotification(__("application.tenantUpdated")));
          if (!userId && tenant) dispatch(getTenantById(tenant.id));
        }}
        onTranslateString={formOnTranslateString}
      />
    </Section>
  );
};

export { ManageTenantAdminData };
