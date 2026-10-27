import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';

import { StockRes } from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import {
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

interface Props {
  stock: StockRes;
  userId?: string;
}

const Container = styled.div`
  margin-bottom: 30px;
`;

const MapSettingsForm = ({ userId, stock }: Props) => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();

  const fetchUrl = `stock/form/map/${stockId}`;
  const sendUrl = `stock/${stockId}/map`;

  const deleteMapBackground = async () => {
    await ApiService.callFetch('DELETE', sendUrl, () => {
      dispatch(successNotification(__('application.mapSettingsUpdated')));
      if (!userId && user!.tenantId) window.location.reload();
    });
  };

  const submitButton = (
    <ButtonsContainer>
      {stock && stock.mapBackground && (
        <Button
          type="button"
          danger
          text="application.delete"
          click={deleteMapBackground}
        />
      )}
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const customSendFetcher = (_formId: string, values: FormData) => {
    return ApiService.sendForm(sendUrl, values, 'PATCH');
  };

  return (
    <Container>
      <FormContainer highlight>
        <ItfApiForm
          formId="mapSettingsForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          useFormDataInsteadOfPlainObject
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onRenderFullField={mapFields}
          onSavedSuccessfully={() => {
            dispatch(successNotification(__('application.mapSettingsUpdated')));
          }}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </Container>
  );
};

export { MapSettingsForm };
