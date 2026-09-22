import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { UserRole } from 'smartbox-types';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from '../../../../components/Branded';
import {
  ButtonsContainer,
  FormContainer,
  Section,
} from '../../../../components/Layout';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { successNotification } from '../../../../actions/notifications';
import { __ } from '../../../../helpers/i18n';
import { mapFields } from '../../../../utils/fields-mapper';
import { useGetMyDetailsQuery, useInvalidateTenantQuery } from 'src/queries';

interface Props {
  userId?: string;
  formId: string;
  tenantFetchUrl?: string;
  tenantSendUrl?: string;
  adminFetchUrl: (userId: string) => string;
  adminSendUrl: (userId: string) => string;
  header?: React.ReactNode;
}

const ManageTenantSettingsForm = ({
  userId,
  formId,
  tenantFetchUrl,
  tenantSendUrl,
  adminFetchUrl,
  adminSendUrl,
  header,
}: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const invalidateTenant = useInvalidateTenantQuery();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  if (!user) return null;

  const isAdminForm = user.role === UserRole.admin && !!userId;
  if ((!tenantFetchUrl || !tenantSendUrl) && !isAdminForm) return null;

  const fetchUrl = isAdminForm ? adminFetchUrl(userId!) : tenantFetchUrl;
  const sendUrl = isAdminForm ? adminSendUrl(userId!) : tenantSendUrl;

  const customSendFetcher = (formId: string, values) => {
    return ApiService.sendForm(sendUrl, values, 'PATCH');
  };

  return (
    <Section highlight>
      <FormContainer>
        {header}
        <ItfApiForm
          formId={formId}
          schemaMayBeDynamic={true}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification(__('application.tenantUpdated')));
            if (!userId) invalidateTenant();
          }}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </Section>
  );
};

export { ManageTenantSettingsForm };
