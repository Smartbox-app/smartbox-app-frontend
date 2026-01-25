import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import {
  ButtonsContainer,
  FormContainer,
  FormHeader,
} from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from '../../../../../App';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { mapFields } from '../../../../../utils/fields-mapper';
import { __ } from '../../../../../helpers/i18n';
import { useParams } from 'react-router';
import { hideModal } from '../../../../../actions/modal';
import { refreshApiTableData } from '../../../../../actions/api-table';

export type ExportProps = {
  configId: string;
};

const Edit = ({ configId }: ExportProps) => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `mobile-config/form/${configId}`;
  const sendUrl = `mobile-config/${configId}`;

  return (
    <FormContainer highlight>
      <FormHeader title="mobileConfig.edit" />
      <ItfApiForm
        formId="addMobileConfigForm"
        schemaMayBeDynamic={false}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={(formId: string, values: any) =>
          ApiService.sendForm(sendUrl, values, 'PATCH')
        }
        submitButton={submitButton}
        onSavedSuccessfully={() => {
          dispatch(successNotification(__('mobileConfig.updated')));
          dispatch(hideModal());
          dispatch(refreshApiTableData());
          history.push('/admin/management/mobile-config/list');
        }}
        onRenderFullField={mapFields}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{
          ReactSelect: ReactSelectOverride,
          ReactCreatableSelect,
        }}
      />
    </FormContainer>
  );
};

export { Edit };
