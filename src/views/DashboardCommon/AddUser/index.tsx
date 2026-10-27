import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { AddUserByAdminReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  PageHeader,
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import { Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

const fetchUrl = 'user/form/add-user-by-admin';
const sendUrl = 'user/add-user-by-admin';

export const AddUser = () => {
  const dispatch = useDispatch();
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.createUserAccount" type="submit" primary />
    </ButtonsContainer>
  );

  return (
    <>
      <PageHeader title="application.addUser" />
      <Section>
        <ButtonsContainer>
          <Button
            to="/admin/management/users"
            text="application.back"
            primary
          />
        </ButtonsContainer>
        <Typography>{__('application.addUserDescription')}</Typography>
        <FormContainer highlight>


          <ItfApiForm
            formId="addUserByAdminForm"
            schemaMayBeDynamic={false}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={(_formId: string, values: AddUserByAdminReq) =>
              ApiService.sendForm(sendUrl, values)
            }
            submitButton={submitButton}
            onSavedSuccessfully={() => {
              dispatch(successNotification(__('application.userAdded')));
              history.push('/admin/management/users/list');
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
