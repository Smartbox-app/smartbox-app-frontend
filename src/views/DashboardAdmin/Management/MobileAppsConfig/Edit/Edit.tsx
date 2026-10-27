import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { MobileConfigReq } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

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
    <>
      <Modal.Header title={__('mobileConfig.edit')} />
      <Modal.Content>
      <FormContainer>
      <ItfApiForm
        formId="editMobileConfigForm"
        schemaCacheEnabled={false}
        schemaMayBeDynamic={true}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={(_formId: string, values: MobileConfigReq) =>
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
      </Modal.Content>
    </>
  );
};

export { Edit };
