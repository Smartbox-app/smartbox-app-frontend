import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch, useSelector } from 'react-redux';
import { StockGroupReq } from 'smartbox-types';
import ReactCreatableSelect from 'react-select/creatable';
import {
  PageHeader,
  ButtonsContainer,
  FormContainer,
  Section,
} from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from '../../../../../App';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { __ } from '../../../../../helpers/i18n';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { mapFields } from '../../../../../utils/fields-mapper';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions } from 'src/components/ui';

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
