import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import {
  ButtonsContainer,
  FormContainer,
  Section,
} from '../../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../../components/Branded';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { history } from 'src/history';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../../../actions/notifications';
import { __ } from '../../../../../../../helpers/i18n';
import { mapFields } from '../../../../../../../utils/fields-mapper';
import { useParams } from 'react-router';
import UserService from '../../../../../../../services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions } from 'src/components/ui';
import { GateAdminReq } from 'smartbox-types';

const Add = () => {
  const dispatch = useDispatch();
  const { stockGroupId } = useParams<{ stockGroupId: string }>();

  const { data: user } = useGetMyDetailsQuery();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `gate/form/add-group/${stockGroupId}`;
  const sendUrl = `gate/admin/group/${stockGroupId}`;

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              to={`/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates`}
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
              `/${UserService.getSlugByRole(user!.role)}/locations/groups/${stockGroupId}/gates`,
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
