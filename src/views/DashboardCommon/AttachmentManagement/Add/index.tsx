import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  PageHeader,
  ButtonsContainer,
  FormContainer,
  Section,
} from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import UserService from 'src/services/user-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

const Add = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'attachment/form';
  const sendUrl = 'attachment';

  return (
    <>
      <PageHeader title="application.addAttachment" />
      <Section>
        <FormContainer highlight>
          <ItfApiForm
            useFormDataInsteadOfPlainObject
            formId="addAttachment"
            schemaCacheEnabled={false}
            schemaMayBeDynamic={true}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={(_formId: string, values: FormData) =>
              ApiService.sendForm(sendUrl, values)
            }
            submitButton={submitButton}
            onRenderFullField={mapFields}
            onSavedSuccessfully={() => {
              dispatch(successNotification(__('application.attachmentAdded')));
              history.push(
                `/${UserService.getSlugByRole(user!.role)}/management/attachments`,
              );
            }}
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
