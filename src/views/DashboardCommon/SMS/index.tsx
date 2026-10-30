import flatpickr from 'flatpickr';
import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { SendSmsReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  FormContainer,
  ButtonsContainer,
  FieldsColumn,
  PageHeader,
  Section,
} from 'src/components/Layout';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

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
