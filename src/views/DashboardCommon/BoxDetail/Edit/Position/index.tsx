import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { useDispatch } from 'react-redux';

import { ChangeBoxReq } from 'smartbox-types';
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
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

import './Position.scss';

interface Props {
  rentId: string;
}

const Position = ({ rentId }: Props) => {
  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.move" type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = `rent/form/change-user-box/${rentId}`;
  const sendUrl = `rent/user-box/${rentId}`;

  const customSendFetcher = (_formId: string, values: ChangeBoxReq) => {
    dispatch(showModal(
      <>
        <Modal.Header title={__('application.confirmation')} />
        <Modal.Content>
          <Alert
            type="notice"
            text="application.userWillGetMailWithInformation"
          />
          <Alert type="notice" text="application.actionCanNotBeUnDone" />
          <Alert
            type="notice"
            text="application.boxMoveAgreementAddendumNotice"
          />
        </Modal.Content>
        <Modal.Actions>
          <ButtonsContainer max>
            <Button
              text="application.cancel"
              danger
              click={() => dispatch(hideModal())}
            />
            <Button
              success
              type="submit"
              text="application.understood"
              click={() =>
                ApiService.sendForm(
                  sendUrl,
                  {
                    ...values,
                  },
                  'PATCH',
                  () => {
                    dispatch(successNotification('notification.userMovedSuccess'));
                    dispatch(refreshApiTableData());
                    dispatch(hideModal());
                  },
                )
              }
            />
          </ButtonsContainer>
        </Modal.Actions>
      </>,
    ));
  };

  return (
    <>
      <Alert
        type="notice"
        text="application.boxMoveAgreementAddendumNotice"
      />
      <ItfApiForm
        formId="change-user-box"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        loadingInfo={<Spinner transparent />}
        onSavedSuccessfully={() => {
          dispatch(hideModal());
          dispatch(refreshApiTableData());
        }}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{
          ReactSelect: ReactSelectOverride,
          ReactCreatableSelect,
        }}
        onRenderFullField={mapFields}
      />
    </>
  );
};

export default Position;
