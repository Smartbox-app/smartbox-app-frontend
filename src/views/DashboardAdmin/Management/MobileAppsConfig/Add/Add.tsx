import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import {
  ButtonsContainer,
  FormContainer,
} from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from '../../../../../App';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { mapFields } from '../../../../../utils/fields-mapper';
import { __ } from '../../../../../helpers/i18n';
import { PageHeader, Section } from 'src/components/ui';

const Add = () => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'mobile-config/form';
  const sendUrl = 'mobile-config';

  return (
    <>
      <PageHeader>{__('mobileConfig.add')}</PageHeader>
      <Section>
        <FormContainer highlight>
          <ItfApiForm
            formId="addMobileConfigForm"
            schemaMayBeDynamic={false}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={(formId: string, values: any) =>
              ApiService.sendForm(sendUrl, values)
            }
            submitButton={submitButton}
            onSavedSuccessfully={() => {
              dispatch(successNotification(__('mobileConfig.added')));
              history.push('/admin/management/mobile-config/list');
            }}
            onRenderFullField={mapFields}
            onTranslateString={formOnTranslateString}
            thirdPartyComponents={{
              ReactSelect: ReactSelectOverride,
              ReactCreatableSelect,
            }}
          />
        </FormContainer>
      </Section>
    </>
  );
};

export { Add };
