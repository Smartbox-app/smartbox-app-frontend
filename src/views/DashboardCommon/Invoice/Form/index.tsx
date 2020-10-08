import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { FormContainer, ButtonsContainer, FormHeader } from '../../../../components/Layout';
import { Spinner, Button } from '../../../../components/Common';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { notifications } from '../../../../actions';
import { __ } from '../../../../helpers/i18n';

interface Props {
  paymentId: string;
  successNotification: (text: string) => void;
}

const Invoice = ({ paymentId, successNotification }: Props) => {
  const loadUrl = 'payment/form/invoice';
  const sendUrl = `payment/create-invoice/${paymentId}`;
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
          successNotification('Poprawnie wygenerowano fakturę');
        }}
        onTranslateString={formOnTranslateString}
      />
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...notifications }, dispatch);

export default connect(null, mapDispatchToProps)(Invoice);
