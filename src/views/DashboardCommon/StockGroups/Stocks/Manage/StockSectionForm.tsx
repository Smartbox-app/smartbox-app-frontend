import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';

import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from 'src/components/Common/ReactSelectOverride';
import {
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import { Section } from 'src/components/ui';
import { history } from 'src/history';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

type StockSectionFormProps = {
  formId: string;
  fetchPath: string;
  sendPath: string;
};

export function StockSectionForm<TValues extends object>({
  formId,
  fetchPath,
  sendPath,
}: StockSectionFormProps) {
  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const handleSavedSuccessfully = () => {
    dispatch(successNotification('notification.stockUpdatedCorrectly'));
    history.push('/admin/locations/stocks');
  };

  return (
    <Section>
      <FormContainer highlight>
        <ItfApiForm
          formId={formId}
          schemaMayBeDynamic={true}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchPath)}
          sendFetcher={(_formId: string, values: TValues) =>
            ApiService.sendForm(sendPath, values, 'PATCH')
          }
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={handleSavedSuccessfully}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{
            ReactSelect: ReactSelectOverride,
            ReactCreatableSelect,
          }}
        />
      </FormContainer>
    </Section>
  );
}
