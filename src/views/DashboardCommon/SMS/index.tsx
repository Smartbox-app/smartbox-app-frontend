import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { SendSmsReq } from 'smartbox-types';
import { useDispatch } from 'react-redux';
import flatpickr from 'flatpickr';
import {
  FormContainer,
  ButtonsContainer,
  FieldsColumn,
  PageHeader,
  Section,
} from '../../../components/Layout';
import { Button, Spinner } from '../../../components/Branded';
import ApiService from '../../../services/api-service';
import { formOnTranslateString } from '../../../utils/trans-form';
import { successNotification } from '../../../actions/notifications';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../components/Common/ReactSelectOverride';
import { mapFields } from '../../../utils/fields-mapper';

const SMS = () => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.send" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'user/form/send-sms';
  const sendUrl = 'user/send-sms';

  const customSendFetcher = (_formId: string, values: SendSmsReq) =>
    ApiService.sendForm(sendUrl, values, 'POST');

  return (
    <>
      <PageHeader title="application.sendSms" />
      <Section>
        <FormContainer highlight>
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
                dispatch(successNotification('application.smsSent'));
              }}
              onRenderFullField={mapFields}
              onTranslateString={formOnTranslateString}
              thirdPartyComponents={{
                ReactSelect: ReactSelectOverride,
                ReactCreatableSelect,
                flatpickr,
              }}
            />
          </FieldsColumn>
        </FormContainer>
      </Section>
    </>
  );
};

export default SMS;
