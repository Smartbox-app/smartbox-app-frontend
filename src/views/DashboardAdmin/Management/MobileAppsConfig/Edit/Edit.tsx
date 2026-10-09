import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { ButtonsContainer, FormContainer } from '../../../../../components/Layout';
import { Modal } from 'src/components/ui';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from 'src/history';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { mapFields } from '../../../../../utils/fields-mapper';
import { __ } from '../../../../../helpers/i18n';

import { hideModal } from '../../../../../actions/modal';
import { refreshApiTableData } from '../../../../../actions/api-table';
import { MobileConfigReq } from 'smartbox-types';

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
