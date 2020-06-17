import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { ChangeStatusReq } from 'smartbox-types';
import { FormContainer, ButtonsContainer } from '../../../../../../../components/Layout';
import { Button } from '../../../../../../../components/Common';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { successNotification } from '../../../../../../../actions/notifications';

import './Status.scss';

interface Props {
  selectedBoxId: string;
}

const Status = ({ selectedBoxId }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="Zmień status" type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = 'rent/form/change-status';
  const sendUrl = 'rent/status';

  const customSendFetcher = (formId: string, values: ChangeStatusReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        number: selectedBoxId,
      },
      'PATCH',
    );

  return (
    <FormContainer className="box-status-form">
      <ItfApiForm
        formId="box-status-form"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onSavedSuccessfully={() => {
          successNotification('Poprawnie zmieniono status');
        }}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
      />
    </FormContainer>
  );
};

export default Status;
