import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router';

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

export const Edit = () => {
  const { lockId, passcodeId } = useParams<{
    lockId: string;
    passcodeId: string;
  }>();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `driver/form/passcode-dates${search}`;
  const sendUrl = `driver/locks/${lockId}/passcodes/${passcodeId}`;

  return (
    <>
      <PageHeader>{__('application.editPasscode')}</PageHeader>
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
            formId="editPasscodeForm"
            schemaMayBeDynamic={true}
            schemaCacheEnabled={false}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={(_formId: string, values: Pick<TTLockPasscodeReq, 'startDate' | 'endDate'>) =>
              ApiService.sendForm(sendUrl, values, 'PATCH')
            }
            submitButton={submitButton}
            onSavedSuccessfully={() => {
              dispatch(successNotification(__('application.passcodeUpdated')));
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
