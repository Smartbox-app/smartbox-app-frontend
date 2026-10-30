import flatpickr from 'flatpickr';
import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { UpdateSettingsReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from 'src/components/Common/ReactSelectOverride';
import {
  FormContainer,
  ButtonsContainer,
  FieldsColumn,
  PageHeader,
  Section,
} from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

const SMS = () => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'settings/form';
  const sendUrl = 'settings';

  const customSendFetcher = (_formId: string, values: UpdateSettingsReq) =>
    ApiService.sendForm(sendUrl, values, 'PATCH');

  return (
    <>
      <PageHeader title="application.settings" />
      <Section>
        <p>{__('settings.description')}</p>
        <FormContainer highlight>
          <FieldsColumn>
            <ItfApiForm
              formId="settingsForm"
              schemaMayBeDynamic={false}
              schemaCacheEnabled={false}
              loadingInfo={<Spinner transparent />}
              schemaFetcher={() => ApiService.loadForm(fetchUrl)}
              sendFetcher={customSendFetcher}
              submitButton={submitButton}
              onSavedSuccessfully={() => {
                dispatch(successNotification('settings.saved'));
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
