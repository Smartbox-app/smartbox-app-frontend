import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { UpdateSettingsReq } from 'smartbox-types';
import { useDispatch } from 'react-redux';
import flatpickr from 'flatpickr';
import {
  FormContainer,
  ButtonsContainer,
  FieldsColumn,
  PageHeader,
  Section,
} from '../../../../components/Layout';
import { Button, Spinner } from '../../../../components/Branded';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { successNotification } from '../../../../actions/notifications';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from '../../../../components/Common/ReactSelectOverride';
import { __ } from '../../../../helpers/i18n';
import { mapFields } from 'src/utils/fields-mapper';

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
