import { useQueryClient } from '@tanstack/react-query';
import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import {
  BoxDisplayStatus,
  BoxStatus,
  ChangeStatusReq,
  RentStatus,
} from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { hideModal, showModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import { Alert } from 'src/components/Common';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from 'src/components/Common/ReactSelectOverride';
import { ButtonsContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { stockBoxesQueryKey } from 'src/queries';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

import 'src/views/DashboardCommon/BoxDetail/Edit/Status/Status.scss';

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

const Status = ({ selectedBoxId, stockId, rentId, currentStatus }: Props) => {
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
              <Alert
                type="error"
                text="application.confirmFreeBoxIrreversible"
              />
            ) : (
              <Alert
                type="notice"
                text="application.confirmChangeStatusAction"
              />
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
      ),
    );
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
      <p>{__('application.phrases.boxUnpaidExtensionWarning')}</p>
    </>
  );
};

export default Status;
