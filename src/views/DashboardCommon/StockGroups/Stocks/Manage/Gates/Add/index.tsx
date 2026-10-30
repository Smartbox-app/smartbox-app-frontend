import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { GateAdminReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from 'src/components/Common/ReactSelectOverride';
import {
  ButtonsContainer,
  FormContainer,
  Section,
} from 'src/components/Layout';
import { HeaderWithActions } from 'src/components/ui';
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

  const fetchUrl = `gate/form/add-stock/${stockId}`;
  const sendUrl = `gate/admin/stock/${stockId}`;

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
        {__('application.addGate')}
      </HeaderWithActions>

      <FormContainer highlight>
        <ItfApiForm
          formId="addGate"
          schemaCacheEnabled={false}
          schemaMayBeDynamic={true}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(_formId: string, values: GateAdminReq) =>
            ApiService.sendForm(sendUrl, values)
          }
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            dispatch(successNotification('notification.gateAddedCorrectly'));
            history.push(
              `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/gates`,
            );
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
  );
};

export { Add };
