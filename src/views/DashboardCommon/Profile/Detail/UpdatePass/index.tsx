import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { UpdatePwdReq } from 'smartbox-types';
import { hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import { ButtonsContainer, FieldsColumn } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

const UpdatePass = () => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.change" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/update-password';
  const sendUrl = 'user/pwd';

  const customSendFetcher = (_formId: string, values: UpdatePwdReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <>
      <Modal.Header title={__('application.changePasswordToService')} />
      <Modal.Content>
      <FieldsColumn>
        <ItfApiForm
          formId="changePass"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification('notification.passChangedSuccess'));
            dispatch(hideModal());
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
        />
      </FieldsColumn>
      </Modal.Content>
    </>
  );
};

export default UpdatePass;
