import React from 'react';
import { connect } from 'react-redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { AddGiftReq } from 'smartbox-types';
import { FormContainer, ButtonsContainer, FieldsColumn, FormHeader } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Common';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { __ } from '../../../../../helpers/i18n';
import { modal, notifications, user } from '../../../../../actions';

import './UpdateMe.scss';

interface Props {
  hideModal: () => void;
  fetchMyData: () => void;
  successNotification: (text: string) => void;
}

const UpdateMe = ({ successNotification, hideModal, fetchMyData }: Props) => {
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
            fetchMyData();
            hideModal();
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
        />
      </FieldsColumn>
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...notifications, ...user }, dispatch);

export default connect(null, mapDispatchToProps)(UpdateMe);
