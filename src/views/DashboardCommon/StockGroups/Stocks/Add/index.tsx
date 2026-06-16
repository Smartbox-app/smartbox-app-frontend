import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import {
  PageHeader,
  ButtonsContainer,
  FormContainer,
  Section,
} from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from 'src/history';
import { ReactSelectOverride, ReactCreatableSelectOverride as ReactCreatableSelect } from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { __ } from '../../../../../helpers/i18n';
import UserService from '../../../../../services/user-service';
import { mapFields } from '../../../../../utils/fields-mapper';
import { useGetMyDetailsQuery } from 'src/queries';
import { Header } from 'src/components/ui';

const Add = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'stock/form/add';
  const sendUrl = 'stock';

  return (
    <>
      <PageHeader title="application.addStock" />
      <Section>
        <Header variant="h2">{__('application.addStockDescription')}</Header>
        <FormContainer highlight>
          <ItfApiForm
            formId="addStock"
            schemaCacheEnabled={false}
            schemaMayBeDynamic={true}
            loadingInfo={<Spinner transparent />}
            schemaFetcher={() => ApiService.loadForm(fetchUrl)}
            sendFetcher={(formId: string, values: any) =>
              ApiService.sendForm(sendUrl, values)
            }
            submitButton={submitButton}
            onRenderFullField={mapFields}
            onSavedSuccessfully={() => {
              dispatch(successNotification('notification.stockAddedCorrectly'));
              history.push(
                `/${UserService.getSlugByRole(user!.role)}/locations/stocks`,
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
