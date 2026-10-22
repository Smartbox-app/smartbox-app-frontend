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
import { useGetMyDetailsQuery } from 'src/queries';
import { Typography } from 'src/components/ui';
import UserService from 'src/services/user-service';
import { Link } from 'react-router-dom';

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
