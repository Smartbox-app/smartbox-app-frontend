import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { useDispatch } from 'react-redux';
import { ChangeBoxReq } from 'smartbox-types';
import { hideModal, showModal } from '../../../../../actions/modal';
import { successNotification } from '../../../../../actions/notifications';
import { ButtonsContainer } from '../../../../../components/Layout';
import { Modal } from 'src/components/ui';
import { Alert } from '../../../../../components/Common';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { __ } from '../../../../../helpers/i18n';

import './Position.scss';
import {
  ReactSelectOverride,
  ReactCreatableSelectOverride as ReactCreatableSelect,
} from '../../../../../components/Common/ReactSelectOverride';
import { mapFields } from '../../../../../utils/fields-mapper';
import { refreshApiTableData } from '../../../../../actions/api-table';

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
