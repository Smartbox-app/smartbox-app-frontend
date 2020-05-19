import React, { Component } from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { changeRentStatusForm } from 'smartbox-types';
import { FormContainer, ButtonsContainer } from '../../../../../../components/Layout';
import { Spinner, Button } from '../../../../../../components/Common';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { successNotification } from '../../../../../../actions/notifications';

class Status extends Component {
  render() {
    const submitButton = (
      <ButtonsContainer>
        <Button text="Wyślij zaproszenie" type="submit" primary />
      </ButtonsContainer>
    );

    const fetchUrl = 'rent/form/change-status';
    const sendUrl = 'user/invite-user';
    return (
      <FormContainer className="login-form">
        <ItfApiForm
          formId="loginForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values: changeRentStatusForm) => ApiService.sendForm(sendUrl, values)}
          submitButton={submitButton}
          onSavedSuccessfully={(data: any) => {
            successNotification('Zalogowano poprawnie');
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
        />
      </FormContainer>
    );
  }
}

export default Status;
