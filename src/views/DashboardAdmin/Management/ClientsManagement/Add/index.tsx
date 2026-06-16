import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import {
  ButtonsContainer,
  FormContainer,
} from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from 'src/history';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { mapFields } from '../../../../../utils/fields-mapper';
import { __ } from '../../../../../helpers/i18n';
import { PageHeader } from 'src/components/ui';

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
          sendFetcher={(formId: string, values: any) =>
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
