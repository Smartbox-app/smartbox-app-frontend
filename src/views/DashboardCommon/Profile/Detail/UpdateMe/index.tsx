import { useQueryClient } from '@tanstack/react-query';
import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { UpdateUserReq } from 'smartbox-types';
import { modal } from 'src/actions';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import { ButtonsContainer, FieldsColumn } from 'src/components/Layout';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

export const UpdateMe = () => {
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

  const fetchUrl = 'user/form/update-me';
  const sendUrl = 'user/me';

  const customSendFetcher = (_formId: string, values: Pick<UpdateUserReq, 'phone'>) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <FieldsColumn>
      <ItfApiForm
          formId="EditUserProfileData"
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
  );
};
