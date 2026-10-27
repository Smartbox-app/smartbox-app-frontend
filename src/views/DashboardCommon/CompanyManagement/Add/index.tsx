import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router';

import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from 'src/components/Common/ReactSelectOverride';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import UserService from 'src/services/user-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';
import { useCanCreateCompany } from '../useCanCreateCompany';

export const Add = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
  const { canCreate, isLoading } = useCanCreateCompany();

  if (!user) return null;

  const listPath = `/${UserService.getSlugByRole(user.role)}/management/settlements`;
  if (isLoading) {
    return <Spinner />;
  }
  if (!canCreate) {
    return <Redirect to={listPath} />;
  }

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button to={listPath} text="application.back" primary />
          </ButtonsContainer>
        }
      >
        {__('application.addCompany')}
      </HeaderWithActions>

      <FormContainer highlight>
        <ItfApiForm
          formId="addCompany"
          schemaCacheEnabled={false}
          schemaMayBeDynamic={true}
          useFormDataInsteadOfPlainObject
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm('company/form')}
          sendFetcher={(_formId: string, values: FormData) =>
            ApiService.sendForm('company', values)
          }
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification('application.companyAdded'));
            history.push(listPath);
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{
            ReactSelect: ReactSelectOverride,
            ReactCreatableSelect,
          }}
        />
      </FormContainer>
    </Section>
  );
};
