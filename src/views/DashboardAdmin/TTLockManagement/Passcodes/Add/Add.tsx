import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import {
  ButtonsContainer,
  FormContainer,
} from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from '../../../../../App';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { mapFields } from '../../../../../utils/fields-mapper';
import { __ } from '../../../../../helpers/i18n';
import { PageHeader, Section } from 'src/components/ui';
import { useParams } from 'react-router';

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
            sendFetcher={(formId: string, values: any) =>
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
