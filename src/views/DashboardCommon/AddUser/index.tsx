import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import {
  PageHeader,
  ButtonsContainer,
  FormContainer,
} from '../../../components/Layout';
import { Button, Spinner } from '../../../components/Branded';
import ApiService from '../../../services/api-service';
import { formOnTranslateString } from '../../../utils/trans-form';
import { history } from 'src/history';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../actions/notifications';
import { mapFields } from '../../../utils/fields-mapper';
import { __ } from '../../../helpers/i18n';
import { Section, Typography } from 'src/components/ui';

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
            sendFetcher={(formId: string, values: any) =>
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
