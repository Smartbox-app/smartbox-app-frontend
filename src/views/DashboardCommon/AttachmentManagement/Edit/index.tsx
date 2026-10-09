import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { ButtonsContainer, FormContainer } from '../../../../components/Layout';
import { Modal } from 'src/components/ui';
import { Button, Spinner } from '../../../../components/Branded';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../actions/notifications';
import { __ } from '../../../../helpers/i18n';
import { mapFields } from '../../../../utils/fields-mapper';
import { hideModal } from '../../../../actions/modal';
import { refreshApiTableData } from '../../../../actions/api-table';

interface Props {
  id: string;
}

const Edit = ({ id }: Props) => {
  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `attachment/form/${id}`;
  const sendUrl = `attachment/${id}`;

  return (
    <>
      <Modal.Header title={__('application.editAttachment')} />
      <Modal.Content>
        <FormContainer>
        <ItfApiForm
        useFormDataInsteadOfPlainObject
        formId="updateAttachment"
        schemaCacheEnabled={false}
        schemaMayBeDynamic={true}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={(_formId: string, values: FormData) =>
          ApiService.sendForm(sendUrl, values, 'PATCH')
        }
        submitButton={submitButton}
        onRenderFullField={mapFields}
        onSavedSuccessfully={() => {
          dispatch(successNotification('notification.attachmentUpdated'));
          dispatch(hideModal());
          dispatch(refreshApiTableData());
        }}
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
