import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { StockRes } from 'smartbox-types';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from '../../../../../../../components/Branded';
import {
  ButtonsContainer,
  FormContainer,
} from '../../../../../../../components/Layout';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { successNotification } from '../../../../../../../actions/notifications';
import { __ } from '../../../../../../../helpers/i18n';
import { mapFields } from '../../../../../../../utils/fields-mapper';
import { useParams } from 'react-router';
import styled from 'styled-components';
import { useGetMyDetailsQuery } from 'src/queries';

interface Props {
  stock: StockRes;
  refreshStock: () => void;
  userId?: string;
}

const Container = styled.div`
  margin-bottom: 30px;
`;

const MapSettingsForm = ({ userId, stock, refreshStock }: Props) => {
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

  const customSendFetcher = (formId: string, values) => {
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
            refreshStock();
          }}
          onTranslateString={formOnTranslateString}
        />
      </FormContainer>
    </Container>
  );
};

export { MapSettingsForm };
