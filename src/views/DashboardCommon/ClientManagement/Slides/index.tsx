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
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

interface Props {
  userId?: string;
}

const ManageTenantSlides = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  if (!user) return null;

  const fetchUrl =
    user.role === UserRole.admin && userId
      ? `tenant/form/admin-slides/${userId}`
      : 'tenant/form/slides';
  const sendUrl =
    user.role === UserRole.admin && userId
      ? `tenant/admin/slides/${userId}`
      : 'tenant/slides';

  const customSendFetcher = (
    formId: string,
    values: { slides?: File[]; [key: string]: string | File[] | undefined },
  ) => {
    const fd = new FormData();
    for (const key in values) {
      const value = values[key];
      if (key === 'slides' && Array.isArray(value)) {
        for (const file of value) {
          fd.append('slides', file);
        }
      } else if (typeof value === 'string') {
        fd.append(key, value);
      }
    }

    return ApiService.sendForm(sendUrl, fd, 'PATCH');
  };

  return (
    <Section highlight>
      <FormContainer>
        <ItfApiForm
          formId="tenantSlidesData"
          schemaMayBeDynamic={true}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          // useFormDataInsteadOfPlainObject
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

export { ManageTenantSlides };
