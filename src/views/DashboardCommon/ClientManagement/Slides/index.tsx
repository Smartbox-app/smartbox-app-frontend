import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { UserRole } from 'smartbox-types';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Spinner } from '../../../../components/Branded';
import {
  ButtonsContainer,
  FormContainer,
  Section,
} from '../../../../components/Layout';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { ApplicationState } from '../../../../reducers';
import { successNotification } from '../../../../actions/notifications';
import { __ } from '../../../../helpers/i18n';
import { mapFields } from '../../../../utils/fields-mapper';
import { useGetMyDetailsQuery } from 'src/queries';

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

  const customSendFetcher = (formId: string, values) => {
    const fd = new FormData();
    for (const key in values) {
      if (key === 'slides' && values.slides) {
        for (const file of values.slides) {
          fd.append('slides', file);
        }
      } else fd.append(key, values[key]);
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
