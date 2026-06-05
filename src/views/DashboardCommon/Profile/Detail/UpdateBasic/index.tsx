import React from 'react';
import { useDispatch } from 'react-redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { AddGiftReq } from 'smartbox-types';
import {
  ButtonsContainer,
  FieldsColumn,
} from '../../../../../components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { modal } from '../../../../../actions';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../components/Common/ReactSelectOverride';
import { mapFields } from '../../../../../utils/fields-mapper';
import { useQueryClient } from '@tanstack/react-query';
import { successNotification } from 'src/actions/notifications';

export const UpdateBasic = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button
        text="application.cancel"
        type="button"
        danger
        click={() => {
          dispatch(modal.hideModal());
        }}
      />
      <Button text="application.change" type="submit" success />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/update-me-basic';
  const sendUrl = 'user/me-basic';

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <>
      <Modal.Header title={__('application.editUserData')} />
      <Modal.Content>
        <FieldsColumn>
          <ItfApiForm
            formId="editUserBasicData"
            schemaMayBeDynamic={false}
            schemaCacheEnabled={false}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={customSendFetcher}
            submitButton={submitButton}
            onSavedSuccessfully={async () => {
              dispatch(successNotification('notification.dataChangedSuccess'));
              dispatch(modal.hideModal());
              queryClient.invalidateQueries({ queryKey: ['my-details'] });
            }}
            onTranslateString={formOnTranslateString}
            onRenderFullField={mapFields}
            thirdPartyComponents={{
              ReactSelect: ReactSelectOverride,
              ReactCreatableSelect,
            }}
          />
        </FieldsColumn>
      </Modal.Content>
    </>
  );
};
