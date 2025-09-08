import React from 'react';
import { useDispatch } from 'react-redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactCreatableSelect from 'react-select/creatable';
import { AddGiftReq } from 'smartbox-types';
import {
  FormContainer,
  ButtonsContainer,
  FieldsColumn,
} from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { modal } from '../../../../../actions';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';
import { mapFields } from '../../../../../utils/fields-mapper';
import { useQueryClient } from '@tanstack/react-query';
import { successNotification } from 'src/actions/notifications';

export const UpdateContact = () => {
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

  const fetchUrl = 'user/form/update-me-contact';
  const sendUrl = 'user/me-contact';

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <FormContainer>
      <FieldsColumn>
        <ItfApiForm
          formId="editUserContactData"
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
    </FormContainer>
  );
};
