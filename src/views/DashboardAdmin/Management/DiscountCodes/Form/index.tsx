import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { AddGiftReq, GiftRes } from 'smartbox-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Common';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { successNotification } from '../../../../../actions/notifications';
import { modal } from '../../../../../actions';
import { __ } from '../../../../../helpers/i18n';

import NewCode from '../NewCode';

import './Form.scss';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

const Form = ({ showModal }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="Utwórz" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'gift/form/add-gift';
  const sendUrl = 'gift/new';

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'POST',
    );

  return (
    <FormContainer className="gift-form">
      <ItfApiForm
        formId="addGiftForm"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onSavedSuccessfully={(data: GiftRes) => {
          successNotification(__('notification.discCodeCreated'));
          showModal(<NewCode newCodeProps={data} />);
        }}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
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

export default connect(null, mapDispatchToProps)(Form);
