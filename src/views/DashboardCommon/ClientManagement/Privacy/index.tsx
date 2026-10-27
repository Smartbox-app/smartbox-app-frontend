import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { UserRole } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import {
  ButtonsContainer,
  FormContainer,
  Section,
} from 'src/components/Layout';
import { Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import UserService from 'src/services/user-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

interface Props {
  userId?: string;
}

const ManageTenantPrivacy = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  const fetchUrl =
    user.role === UserRole.admin && userId
      ? `tenant/form/admin-privacy/${userId}`
      : 'tenant/form/privacy';
  const sendUrl =
    user.role === UserRole.admin && userId
      ? `tenant/admin/privacy/${userId}`
      : 'tenant/privacy';

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const customSendFetcher = (_formId: string, values: FormData) => {
    return ApiService.sendForm(sendUrl, values, 'POST');
  };

  return (
    <Section highlight>
      <Typography>
        {__('application.phrases.privacyMoved')}{' '}
        <Link
          to={`/${UserService.getSlugByRole(user.role)}/management/documents`}
        >
          {__('application.documents')}
        </Link>
        .
      </Typography>
      <FormContainer>
        <ItfApiForm
          formId="tenantPrivacyForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          useFormDataInsteadOfPlainObject
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification(__('application.tenantUpdated')));
          }}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </Section>
  );
};

export { ManageTenantPrivacy };
