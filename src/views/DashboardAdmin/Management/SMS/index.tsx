import React from 'react';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { DiscountReq } from 'smartbox-types';
import { connect } from 'react-redux';
import flatpickr from 'flatpickr';
import { FormContainer, ButtonsContainer, FieldsColumn, PageHeader, Section } from '../../../../components/Layout';
import { Button, Spinner } from '../../../../components/Common';
import FormHeader from '../../../../components/Layout/FormHeader';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { notifications } from '../../../../actions';
import { __ } from '../../../../helpers/i18n';

interface Props {
  successNotification: (text: string) => void;
}

const SMS = ({ successNotification }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text='application.send' type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/send-sms';
  const sendUrl = 'user/send-sms';

  const customSendFetcher = (formId: string, values: DiscountReq) => ApiService.sendForm(sendUrl, values, 'POST');

  return (
    <Section full>
      <PageHeader title={__('application.sendSms')} />
      <FormContainer>
        <FieldsColumn>
          <ItfApiForm
            formId="sendSmsForm"
            schemaMayBeDynamic={false}
            schemaCacheEnabled={false}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={customSendFetcher}
            submitButton={submitButton}
            onSavedSuccessfully={() => {
              successNotification(__('application.smsSent'));
            }}
            onTranslateString={formOnTranslateString}
            thirdPartyComponents={{ ReactSelect, ReactCreatableSelect, flatpickr }}
          />
        </FieldsColumn>
      </FormContainer>
    </Section>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...notifications,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(SMS);
