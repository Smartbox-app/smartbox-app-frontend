import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactCreatableSelect from 'react-select/creatable';
import { AddGiftReq, GiftRes } from 'smartbox-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ButtonsContainer, FieldsColumn } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { modal, notifications } from '../../../../../actions';

import NewCode from '../NewCode';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';

interface Props {
  showModal: (content: React.ReactNode) => void;
  successNotification: (text: string) => void;
}

const Form = ({ showModal, successNotification }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.create" type="submit" primary />
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
      <FieldsColumn>
          <ItfApiForm
              formId="addGiftForm"
              schemaMayBeDynamic={false}
              schemaCacheEnabled={false}
              loadingInfo={<Spinner transparent/>}
              schemaFetcher={() => ApiService.loadForm(fetchUrl)}
              sendFetcher={customSendFetcher}
              submitButton={submitButton}
              onSavedSuccessfully={(data: GiftRes) => {
                  successNotification('notification.discCodeCreated');
                  showModal(<NewCode newCodeProps={data}/>);
              }}
              onTranslateString={formOnTranslateString}
              thirdPartyComponents={{ReactSelect: ReactSelectOverride, ReactCreatableSelect}}
          />
      </FieldsColumn>
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

export default connect(null, mapDispatchToProps)(Form);
