import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import {
  BoxDisplayStatus,
  BoxStatus,
  ChangeStatusReq,
  RentStatus,
} from 'smartbox-types';
import { hideModal, showModal } from '../../../../../actions/modal';
import { successNotification } from '../../../../../actions/notifications';
import { ButtonsContainer } from '../../../../../components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from '../../../../../helpers/i18n';
import { Alert } from '../../../../../components/Common';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';

import './Status.scss';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from '../../../../../components/Common/ReactSelectOverride';
import { refreshApiTableData } from '../../../../../actions/api-table';
import { mapFields } from '../../../../../utils/fields-mapper';
import { useQueryClient } from '@tanstack/react-query';
import { stockBoxesQueryKey } from 'src/queries';

const STATUSES_REQUIRING_FREE_CONFIRMATION: BoxDisplayStatus[] = [
  RentStatus.rented,
  RentStatus.toCheck,
  RentStatus.toExplain,
];

const hasSelectedStatus = (status: ChangeStatusReq['status'] | undefined) =>
  status !== null && status !== undefined && String(status).length > 0;

interface Props {
  selectedBoxId: string;
  stockId: string;
  rentId?: string;
  currentStatus: BoxDisplayStatus;
}

const Status = ({
  selectedBoxId,
  stockId,
  rentId,
  currentStatus,
}: Props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.changeStatus" type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = rentId
    ? `rent/form/change-box-status/${selectedBoxId}/${rentId}`
    : `rent/form/change-box-status/${selectedBoxId}`;
  const sendUrl = `rent/status/${stockId}/${rentId || ''}`;

  const submitStatusChange = (values: ChangeStatusReq) => {
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        boxId: selectedBoxId,
      } as ChangeStatusReq,
      'PATCH',
      () => {
        dispatch(successNotification('notification.userStatusChanged'));
        dispatch(refreshApiTableData());
        queryClient.invalidateQueries({
          queryKey: stockBoxesQueryKey(stockId),
        });
        dispatch(hideModal());
      },
    );
  };

  const customSendFetcher = (_formId: string, values: ChangeStatusReq) => {
    const isFreeingOccupyingRent =
      values.status === BoxStatus.free &&
      STATUSES_REQUIRING_FREE_CONFIRMATION.includes(currentStatus);

    dispatch(
      showModal(
      <>
        <Modal.Header title={__('application.confirmation')} />
        <Modal.Content>
          <Alert
            type="warning"
            text="application.userWillNotGetMailWithInformation"
          />
          {isFreeingOccupyingRent ? (
            <Alert type="error" text="application.confirmFreeBoxIrreversible" />
          ) : (
            <Alert type="notice" text="application.confirmChangeStatusAction" />
          )}
        </Modal.Content>
        <Modal.Actions>
          <ButtonsContainer>
            <Button
              text="application.cancel"
              danger
              click={() => dispatch(hideModal())}
            />
            <Button
              success
              type="submit"
              text="application.yes"
              click={() => submitStatusChange(values)}
            />
          </ButtonsContainer>
        </Modal.Actions>
      </>,
    ));
  };

  return (
    <>
      <ItfApiForm
        formId="box-status-form"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        loadingInfo={<Spinner transparent />}
        onTranslateString={formOnTranslateString}
        onRenderFullField={mapFields}
        onValidateField={(field) => {
          if (field.id === 'status' && !hasSelectedStatus(field.value)) {
            return __('application.notChooseStatus');
          }
          return undefined as never;
        }}
        thirdPartyComponents={{
          ReactSelect: ReactSelectOverride,
          ReactCreatableSelect,
        }}
      />
      <p>
        Skrytki posiadające nieopłacone przedłużenie nie mogą być bezpośrednio
        zwolnione ani wyłączone z użytku - najpierw należy zweryfikować kwestię
        wynajmu.
      </p>
    </>
  );
};

export default Status;
