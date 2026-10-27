import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { AddTenantReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import { PageHeader } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

const AddTenant = () => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.sendInvitation" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/add-tenant';
  const sendUrl = 'user/add-tenant';

  return (
    <>
      <PageHeader>{__('application.addTenant')}</PageHeader>
      <ButtonsContainer>
        <Button
          to="/admin/management/clients"
          text="application.back"
          primary
        />
      </ButtonsContainer>

      <FormContainer highlight>
        <ItfApiForm
          formId="addTenantForm"
          schemaMayBeDynamic={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(_formId: string, values: AddTenantReq) =>
            ApiService.sendForm(sendUrl, values)
          }
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            dispatch(successNotification(__('application.tenantAdded')));
            history.push('/admin/management/clients/list');
          }}
          onRenderFullField={mapFields}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{
            ReactSelect: ReactSelectOverride,
            ReactCreatableSelect,
          }}
        />
      </FormContainer>
    </>
  );
};

export { AddTenant };
