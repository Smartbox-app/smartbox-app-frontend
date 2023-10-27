import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { FormContainer, ButtonsContainer, FormHeader } from '../../../../components/Layout';
import { Spinner, Button } from '../../../../components/Branded';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { notifications, modal } from '../../../../actions';

interface Props {
  paymentId: string;
  successNotification: (text: string) => void;
  hideModal: () => void;
}

const Invoice = ({ paymentId, successNotification, hideModal }: Props) => {
  const loadUrl = 'payment/form/invoice';
  const sendUrl = `payment/create-invoice/${paymentId}`;
  const METHOD = 'POST';

  const submitButton = (
    <ButtonsContainer max>
      <Button text='application.generateInvoice' type="submit" primary />
    </ButtonsContainer>
  );

  return (
    <FormContainer className="invoice-form">
      <FormHeader title='application.invoiceCreateData' />
      <ItfApiForm
        formId="nip-form"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(loadUrl)}
        sendFetcher={(formId: string, values: any) => ApiService.sendForm(sendUrl, values, METHOD)}
        submitButton={submitButton}
        onSavedSuccessfully={(data: any) => {
          if (data === null) {
            successNotification('notification.invoiceSent');
            hideModal();
          }
        }}
        onTranslateString={formOnTranslateString}
      />
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...notifications, ...modal }, dispatch);

export default connect(null, mapDispatchToProps)(Invoice);
