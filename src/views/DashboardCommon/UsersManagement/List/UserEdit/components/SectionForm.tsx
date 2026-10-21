import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { Button, Spinner } from 'src/components/Branded';
import { ButtonsContainer, FieldsColumn } from 'src/components/Layout';
import ApiService from 'src/services/api-service';
import { formOnTranslateString } from 'src/utils/trans-form';
import { mapFields } from 'src/utils/fields-mapper';

type SectionFormProps = {
  formId: string;
  fetchUrl: string;
  sendUrl: string;
  onSaved: () => void;
};

const submitButton = (
  <ButtonsContainer>
    <Button text="application.save" type="submit" primary />
  </ButtonsContainer>
);

export const SectionForm = ({
  formId,
  fetchUrl,
  sendUrl,
  onSaved,
}: SectionFormProps) => (
  <FieldsColumn>
    <ItfApiForm
      formId={formId}
      schemaMayBeDynamic={false}
      schemaCacheEnabled={false}
      loadingInfo={<Spinner transparent />}
      schemaFetcher={() => ApiService.loadForm(fetchUrl)}
      sendFetcher={(_formId, values) => ApiService.sendForm(sendUrl, values, 'PATCH')}
      submitButton={submitButton}
      onRenderFullField={mapFields}
      onSavedSuccessfully={onSaved}
      onTranslateString={formOnTranslateString}
    />
  </FieldsColumn>
);
