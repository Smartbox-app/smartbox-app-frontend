import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import {
  PageHeader,
  ButtonsContainer,
  FormContainer,
  Section,
} from '../../../../components/Layout';
import { Button, Spinner } from '../../../../components/Branded';
import ApiService from '../../../../services/api-service';
import { formOnTranslateString } from '../../../../utils/trans-form';
import { history } from 'src/history';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../actions/notifications';
import { __ } from '../../../../helpers/i18n';
import UserService from '../../../../services/user-service';
import { mapFields } from '../../../../utils/fields-mapper';
import { useGetMyDetailsQuery } from 'src/queries';

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
