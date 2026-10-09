import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import {
  ButtonsContainer,
  FormContainer,
} from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { history } from 'src/history';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from '../../../../../components/Common/ReactSelectOverride';
import { successNotification } from '../../../../../actions/notifications';
import { mapFields } from '../../../../../utils/fields-mapper';
import { Section } from 'src/components/ui';

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
