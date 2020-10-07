import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { AddGiftReq } from 'smartbox-types';
import { FormContainer, ButtonsContainer, FieldsColumn, FormHeader } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Common';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { successNotification } from '../../../../../actions/notifications';
import { __ } from '../../../../../helpers/i18n';

import './UpdateMe.scss';

const UpdateMe = () => {
  const submitButton = (
    <ButtonsContainer>
      <Button text={__('application.change')} type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/update-me';
  const sendUrl = 'user/me';

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <FormContainer className="gift-form">
      <FormHeader title="Edytujesz swoje dane" />
      <FieldsColumn>
        <ItfApiForm
          formId="EditUserProfileData"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            successNotification(__('notification.dataChangedSuccess'));
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
        />
      </FieldsColumn>
    </FormContainer>
  );
};

export default UpdateMe;
