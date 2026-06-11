import React from 'react';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { DiscountReq } from 'smartbox-types';
import { connect } from 'react-redux';
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
import { notifications } from '../../../../actions';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from '../../../../components/Common/ReactSelectOverride';
import { __ } from '../../../../helpers/i18n';
import { mapFields } from 'src/utils/fields-mapper';

interface Props {
  successNotification: (text: string) => void;
}

const SMS = ({ successNotification }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'settings/form';
  const sendUrl = 'settings';

  const customSendFetcher = (formId: string, values: DiscountReq) =>
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
                successNotification('settings.saved');
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

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...notifications,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(SMS);
