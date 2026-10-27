import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { StockGroupReq } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
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
  const { data: user } = useGetMyDetailsQuery();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'stock-group/form';
  const sendUrl = 'stock-group';

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              to={`/${UserService.getSlugByRole(user!.role)}/locations/groups`}
              text="application.back"
              primary
            />
          </ButtonsContainer>
        }
      >
        {__('application.addStockGroup')}
      </HeaderWithActions>

      <p>{__('application.addStockGroupDescription')}</p>
      <FormContainer highlight>
        <ItfApiForm
          formId="addStockGroup"
          schemaCacheEnabled={false}
          schemaMayBeDynamic={true}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={(formId: string, values: StockGroupReq) =>
            ApiService.sendForm(sendUrl, values)
          }
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(
              successNotification('notification.stockGroupAddedCorrectly'),
            );
            history.push(
              `/${UserService.getSlugByRole(user!.role)}/locations/groups`,
            );
          }}
          onTranslateString={formOnTranslateString}
          // thirdPartyComponents={{
          //   ReactSelect: ReactSelectOverride,
          //   ReactCreatableSelect,
          // }}
        />
      </FormContainer>
    </Section>
  );
};

export { Add };
