import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { UserRole } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import {
  ButtonsContainer,
  FormContainer,
  Section,
} from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import { useGetMyDetailsQuery, useInvalidateTenantQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

interface Props {
  userId?: string;
}

const ManageTenantData = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const invalidateTenant = useInvalidateTenantQuery();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  if (!user) return null;

  const fetchUrl =
    user.role === UserRole.admin && userId
      ? `tenant/form/admin-data/${userId}`
      : 'tenant/form/data';
  const sendUrl =
    user.role === UserRole.admin && userId
      ? `tenant/admin/data/${userId}`
      : 'tenant/data';

  const customSendFetcher = (formId: string, values: object) => {
    return ApiService.sendForm(sendUrl, values, 'PATCH');
  };

  return (
    <Section highlight>
      <FormContainer>
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
            dispatch(successNotification(__('application.tenantUpdated')));
            if (!userId) invalidateTenant();
          }}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </Section>
  );
};

export { ManageTenantData };
