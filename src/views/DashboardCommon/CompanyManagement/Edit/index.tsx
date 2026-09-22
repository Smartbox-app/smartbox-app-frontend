import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { ButtonsContainer, FormContainer } from 'src/components/Layout';
import { Button, Spinner } from 'src/components/Branded';
import ApiService from 'src/services/api-service';
import { formOnTranslateString } from 'src/utils/trans-form';
import { history } from 'src/history';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from 'src/components/Common/ReactSelectOverride';
import { successNotification } from 'src/actions/notifications';
import { __ } from 'src/helpers/i18n';
import UserService from 'src/services/user-service';
import { mapFields } from 'src/utils/fields-mapper';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions, Section, Stack } from 'src/components/ui';
import { CompanyInvoiceStatus } from '../CompanyInvoiceStatus';

export const Edit = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { data: user } = useGetMyDetailsQuery();

  if (!user || !id) return null;

  const listPath = `/${UserService.getSlugByRole(user.role)}/management/settlements`;

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
        {__('application.editCompany')}
      </HeaderWithActions>

      <Stack>
        <FormContainer highlight>
          <CompanyInvoiceStatus companyId={id} />
          <ItfApiForm
            formId="editCompany"
            schemaCacheEnabled={false}
            schemaMayBeDynamic={true}
            useFormDataInsteadOfPlainObject
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(`company/form/${id}`)}
            sendFetcher={(_formId: string, values: FormData) =>
              ApiService.sendForm(`company/${id}`, values, 'PATCH')
            }
            submitButton={submitButton}
            onRenderFullField={mapFields}
            onSavedSuccessfully={() => {
              dispatch(successNotification('application.companyUpdated'));
              history.push(listPath);
            }}
            onTranslateString={formOnTranslateString}
            thirdPartyComponents={{
              ReactSelect: ReactSelectOverride,
              ReactCreatableSelect,
            }}
          />
        </FormContainer>
      </Stack>
    </Section>
  );
};
