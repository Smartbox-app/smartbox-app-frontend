import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Spinner, Button } from '../../../../../components/Common';
import ApiService from '../../../../../services/api-service';
import { successNotification } from '../../../../../actions/notifications';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { __ } from '../../../../../helpers/i18n';

interface Props {
  orderId: string;
}

const Invoice = ({ orderId }: Props) => {
  const loadUrl = 'payment/form/invoice';
  const sendUrl = `payment/create-invoice/${orderId}`;
  const METHOD = 'POST';

  const submitButton = (
    <ButtonsContainer>
      <Button text={__('application.sendInvitation')} type="submit" primary />
    </ButtonsContainer>
  );

  return (
    <FormContainer className="invoice-form">
      <ItfApiForm
        formId="loginForm"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(loadUrl)}
        sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values, METHOD)}
        submitButton={submitButton}
        onSavedSuccessfully={() => {
          successNotification('Tak');
        }}
        onTranslateString={formOnTranslateString}
      />
    </FormContainer>
  );
};

export default Invoice;
