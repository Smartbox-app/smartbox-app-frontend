import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { AddGiftReq, GiftRes } from 'smartbox-types';
import { modal, notifications } from 'src/actions';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

import { NewCode } from '../NewCode';

interface Props {
  stockId: string;
}

const Form = ({ stockId }: Props) => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.create" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `gift/form/add-gift/${stockId}`;
  const sendUrl = 'gift/new';

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        stockId,
      },
      'POST',
    );

  return (
    <FormContainer>
      <ItfApiForm
        formId="addGiftForm"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onSavedSuccessfully={(data: GiftRes) => {
          dispatch(
            notifications.successNotification('notification.discCodeCreated'),
          );
          dispatch(modal.showModal(<NewCode newCodeProps={data} />));
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

export { Form };
