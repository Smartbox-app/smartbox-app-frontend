import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { connect } from 'react-redux';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { AddGiftReq } from 'smartbox-types';
import { modal, notifications } from '../../../../../actions';
import { FormContainer, ButtonsContainer, FormHeader, FieldsColumn } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Common';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { __ } from '../../../../../helpers/i18n';

interface Props {
  successNotification: (text: string) => void;
  hideModal: () => void;
}

const UpdatePass = ({ successNotification, hideModal }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text={__('application.change')} type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/update-password';
  const sendUrl = 'user/pwd';

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <FormContainer>
      <FormHeader title={__('application.changePasswordToService')} />
      <FieldsColumn>
        <ItfApiForm
          formId="changePass"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            successNotification(__('notification.passChangedSuccess'));
            hideModal();
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
        />
      </FieldsColumn>
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...notifications,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(UpdatePass);
