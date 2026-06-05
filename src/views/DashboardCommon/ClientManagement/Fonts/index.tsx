import React from "react";
import { ItfApiForm } from "itf_formbuilder_react";
import { UserRole } from "smartbox-types";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner } from "../../../../components/Branded";
import { ButtonsContainer, FormContainer, Section } from "../../../../components/Layout";
import ApiService from "../../../../services/api-service";
import { formOnTranslateString } from "../../../../utils/trans-form";
import { successNotification } from "../../../../actions/notifications";
import { __ } from "../../../../helpers/i18n";
import { mapFields } from "../../../../utils/fields-mapper";
import { useTenant } from "../../../../hooks/useTenant";
import { useGetMyDetailsQuery } from "src/queries";

interface Props {
  userId?: string;
}

const ManageTenantFonts = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const { tenant } = useTenant();

  if (!user) return null;

  const fetchUrl =
    user.role === UserRole.admin && userId
      ? `tenant/form/admin-fonts/${userId}`
      : "tenant/form/fonts";
  const sendUrl =
    user.role === UserRole.admin && userId
      ? `tenant/admin/fonts/${userId}`
      : "tenant/fonts";

  const deleteImage = async () => {
    await ApiService.callFetch("DELETE", sendUrl, () => {
      dispatch(successNotification(__("application.tenantUpdated")));
      if (!userId && user.tenantId) window.location.reload();
    });
  };

  const submitButton = (
    <ButtonsContainer>
      {tenant && tenant.background && (
        <Button
          type="button"
          danger
          text="application.delete"
          click={deleteImage}
        />
      )}
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const customSendFetcher = (formId: string, values) => {
    return ApiService.sendForm(sendUrl, values, "POST");
  };

  return (
    <Section highlight>
      <FormContainer>
      <ItfApiForm
        formId="tenantFonts"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        useFormDataInsteadOfPlainObject
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onRenderFullField={mapFields}
        onSavedSuccessfully={() => {
          dispatch(successNotification(__("application.tenantUpdated")));
        }}
        onTranslateString={formOnTranslateString}
      />
      </FormContainer>
    </Section>
  );
};

export { ManageTenantFonts };
