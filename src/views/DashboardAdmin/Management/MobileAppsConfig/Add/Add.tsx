import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { MobileConfigReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import { PageHeader, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

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
            sendFetcher={(_formId: string, values: MobileConfigReq) =>
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
