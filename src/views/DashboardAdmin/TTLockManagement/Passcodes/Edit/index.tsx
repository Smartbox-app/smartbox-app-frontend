import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import {
  ButtonsContainer,
  FormContainer,
} from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from 'src/history';
import { successNotification } from '../../../../../actions/notifications';
import { mapFields } from '../../../../../utils/fields-mapper';
import { __ } from '../../../../../helpers/i18n';
import { PageHeader, Section } from 'src/components/ui';
import { TTLockPasscodeReq } from 'smartbox-types';

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
