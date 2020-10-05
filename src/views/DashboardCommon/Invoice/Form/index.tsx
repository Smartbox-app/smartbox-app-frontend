import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { FormContainer, ButtonsContainer, FormHeader } from '../../../../components/Layout';
import { Spinner, Button } from '../../../../components/Common';
import ApiService from '../../../../services/api-service';
import { successNotification } from '../../../../actions/notifications';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { __ } from '../../../../helpers/i18n';

interface Props {
  orderId: string;
}

const Invoice = ({ orderId }: Props) => {
  const loadUrl = 'payment/form/invoice';
  const sendUrl = `payment/create-invoice/${orderId}`;
  const METHOD = 'POST';

  const submitButton = (
    <ButtonsContainer max>
      <Button text={__('application.generateInvoice')} type="submit" primary />
    </ButtonsContainer>
  );

  return (
    <FormContainer className="invoice-form">
      <FormHeader title="Generowanie faktury - dane" />
      <ItfApiForm
        formId="nip-form"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(loadUrl)}
        sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values, METHOD)}
        submitButton={submitButton}
        onSavedSuccessfully={(data: any) => {
          console.log('onSavedSuccessfully', data);
          successNotification('Poprawnie wygenerowano fakturę');
        }}
        onTranslateString={formOnTranslateString}
      />
    </FormContainer>
  );
};

export default Invoice;
