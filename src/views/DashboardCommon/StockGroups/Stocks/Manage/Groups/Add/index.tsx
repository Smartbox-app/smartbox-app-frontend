import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import UserService from 'src/services/user-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

const Add = () => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();

  const { data: user } = useGetMyDetailsQuery();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'box-group-new/form';
  const sendUrl = 'box-group-new';

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/groups`}
              text="application.back"
              primary
            />
          </ButtonsContainer>
        }
      >
        {__('application.addBoxGroup')}
      </HeaderWithActions>

      <FormContainer highlight>
        <ItfApiForm
          formId="addBoxGroup"
          schemaCacheEnabled={false}
          schemaMayBeDynamic={true}
          useFormDataInsteadOfPlainObject
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values: FormData) => {
            values.set('stockId', stockId);
            return ApiService.sendForm(sendUrl, values);
          }}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification('application.boxGroupAdded'));
            history.push(
              `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/groups`,
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
  );
};

export { Add };
