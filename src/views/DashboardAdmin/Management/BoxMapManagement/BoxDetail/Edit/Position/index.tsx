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

import './Position.scss';

interface Props {
  selectedBoxId: string;
  rentId?: string;
}

const Position = ({ rentId, selectedBoxId }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="Przenieś" type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = `rent/form/change-user-box/${rentId}`;
  const sendUrl = `rent/user-box/${rentId}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <FormContainer className="box-status-form">
      <ItfApiForm
        formId="change-user-box"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onSavedSuccessfully={() => {
          successNotification('Poprawnie przeniesiono użytkownika');
        }}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
      />
    </FormContainer>
  );
};

export default Position;
