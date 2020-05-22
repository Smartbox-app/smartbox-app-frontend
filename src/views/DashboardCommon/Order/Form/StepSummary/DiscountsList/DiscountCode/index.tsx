import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { GetGiftReq, GetGiftRes } from 'smartbox-types';
import { Input, Button } from '../../../../../../../components/Common';
import { FormContainer, ButtonsContainer } from '../../../../../../../components/Layout';
import { modal } from '../../../../../../../actions';
import FormHeader from '../../../../../../../components/Layout/FormHeader';
import ApiService from '../../../../../../../services/api-service';
import { successNotification } from '../../../../../../../actions/notifications';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';

interface Props {
  hideModal: () => void;
}

const DiscoutCode = ({ hideModal }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="Dodaj" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'gift/form/get-gift-details';
  const sendUrl = 'gift/details';

  const customSendFetcher = (formId: string, values: GetGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'POST',
    );

  return (
    <FormContainer className="gift-form">
      <FormHeader title="Podaj Twój kod rabatopwy" />
      <ItfApiForm
        formId="getGiftForm"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onSavedSuccessfully={(data: GetGiftRes) => {
          successNotification('Poprawnie odczytano kod rabatowy');
          // zapisac do reducera
          hideModal();
        }}
        onTranslateString={formOnTranslateString}
      />
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(DiscoutCode);
