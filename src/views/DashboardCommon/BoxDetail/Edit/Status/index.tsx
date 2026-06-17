import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChangeStatusReq } from 'smartbox-types';
import { boxes, modal, notifications, stock } from '../../../../../actions';
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

interface Props {
  selectedBoxId: string;
  stockId: string;
  hideModal: () => void;
  successNotification: (text: string) => void;
  showModal: (content: React.ReactNode) => void;
  rentId?: string;
}

const Status = ({
  selectedBoxId,
  hideModal,
  successNotification,
  stockId,
  rentId,
  showModal,
}: Props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.changeStatus" type="submit" danger />
    </ButtonsContainer>
  );

  if (!stock) return null;

  const fetchUrl = `rent/form/change-status/${rentId || ''}`;
  const sendUrl = `rent/status/${stockId}/${rentId || ''}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) => {
    showModal(
      <>
        <Modal.Header title={__('application.confirmation')} />
        <Modal.Content>
          {values.status === null || values.status.length === 0 ? (
            <Alert type="error" text="application.notChooseStatus" />
          ) : (
            <>
              <Alert
                type="warning"
                text="application.userWillNotGetMailWithInformation"
              />
              <Alert type="notice" text="application.actionCanNotBeUnDone" />
            </>
          )}
        </Modal.Content>
        <Modal.Actions>
          <ButtonsContainer>
            <Button
              text="application.cancel"
              danger
              click={() => hideModal()}
            />
            <Button
              success
              type="submit"
              text="application.understood"
              disabled={values.status === null || values.status.length === 0}
              click={() =>
                ApiService.sendForm(
                  sendUrl,
                  {
                    ...values,
                    boxId: selectedBoxId,
                  } as ChangeStatusReq,
                  'PATCH',
                  () => {
                    successNotification('notification.userStatusChanged');
                    dispatch(refreshApiTableData());
                    queryClient.invalidateQueries({
                      queryKey: stockBoxesQueryKey(stockId),
                    });
                    hideModal();
                  },
                )
              }
            />
          </ButtonsContainer>
        </Modal.Actions>
      </>,
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

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    { ...stock, ...modal, ...notifications, ...boxes },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Status);
