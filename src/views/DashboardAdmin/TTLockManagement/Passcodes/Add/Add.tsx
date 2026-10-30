import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { TTLockPasscodeReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
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

export const Add = () => {
  const { lockId } = useParams<{ lockId: string }>();
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.add" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'driver/form/passcode';
  const sendUrl = `driver/locks/${lockId}/passcodes`;

  return (
    <>
      <PageHeader>{__('application.addPasscode')}</PageHeader>
      <Section>
        <ButtonsContainer>
          <Button
            to={`/admin/drivers/locks/${lockId}/passcodes`}
            text="application.back"
            primary
          />
        </ButtonsContainer>

        <FormContainer highlight>
          <ItfApiForm
            formId="addPasscodeForm"
            schemaMayBeDynamic={false}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={(_formId: string, values: TTLockPasscodeReq) =>
              ApiService.sendForm(sendUrl, values)
            }
            submitButton={submitButton}
            onSavedSuccessfully={() => {
              dispatch(successNotification(__('application.passcodeAdded')));
              history.push(`/admin/drivers/locks/${lockId}/passcodes`);
            }}
            onRenderFullField={mapFields}
            onTranslateString={formOnTranslateString}
          />
        </FormContainer>
      </Section>
    </>
  );
};
