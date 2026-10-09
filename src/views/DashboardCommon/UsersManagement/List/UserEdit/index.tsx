import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { UpdateUserReq } from 'smartbox-types';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from '../../../../../components/Branded';
import { ButtonsContainer, FieldsColumn } from '../../../../../components/Layout';
import { Modal } from 'src/components/ui';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { refreshApiTableData } from '../../../../../actions/api-table';
import { hideModal } from '../../../../../actions/modal';
import { successNotification } from '../../../../../actions/notifications';
import { __ } from '../../../../../helpers/i18n';
import { mapFields } from '../../../../../utils/fields-mapper';

interface Props {
  userId: string;
}

const UserEdit = ({ userId }: Props) => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `user/form/update-user/${userId}`;
  const sendUrl = `user/someone/${userId}`;

  const customSendFetcher = (_formId: string, values: UpdateUserReq) => {
    return ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );
  };

  return (
    <>
      <Modal.Header title={__('application.editUserData')} />
      <Modal.Content>
      <FieldsColumn>
        <ItfApiForm
          formId="editUserForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification(__('application.changesSavedSuccess')));
            dispatch(refreshApiTableData());
            dispatch(hideModal());
          }}
          onTranslateString={formOnTranslateString}
        />
      </FieldsColumn>
      </Modal.Content>
    </>
  );
};

export default UserEdit;
