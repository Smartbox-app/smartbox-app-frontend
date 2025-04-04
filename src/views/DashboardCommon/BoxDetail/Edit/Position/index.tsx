import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import { connect, useDispatch } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { ChangeStatusReq } from 'smartbox-types';
import { boxes, modal, notifications } from '../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Alert, FieldsMapper } from '../../../../../components/Common';
import { Button, Spinner } from '../../../../../components/Branded';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { __ } from '../../../../../helpers/i18n';

import './Position.scss';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';
import { mapFields } from '../../../../../utils/fields-mapper';
import { refreshApiTableData } from '../../../../../actions/api-table';

interface Props {
  rentId: string;
  stockId: string;
  hideModal: () => void;
  successNotification: (text: string) => void;
  showModal: (content: React.ReactNode) => void;
  callback?: () => void;
}

const Position = ({ rentId, stockId, successNotification, hideModal, showModal, callback }: Props) => {
  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.move" type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = `rent/form/change-user-box/${rentId}`;
  const sendUrl = `rent/user-box/${rentId}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) => {
    showModal(
      <>
        <div className="modal-alert-wrapper">
          <Alert type="notice" text="application.userWillGetMailWithInformation" />
          <Alert type="notice" text="application.actionCanNotBeUnDone" />
        </div>
        <ButtonsContainer max>
          <Button text="application.cancel" danger click={() => hideModal()} />
          <Button
            success
            type="submit"
            text="application.understood"
            click={async () => {
              hideModal();
              await ApiService.sendForm(
                sendUrl,
                {
                  ...values,
                },
                'PATCH',
              );
              successNotification('notification.userMovedSuccess');
              if(callback) callback();
              dispatch(refreshApiTableData());
            }}
          />
        </ButtonsContainer>
      </>,
    );
  };

  return (
    <FormContainer className="box-status-form">
      <ItfApiForm
        formId="change-user-box"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        loadingInfo={<Spinner transparent />}
        onSavedSuccessfully={() => {
          hideModal();
          dispatch(refreshApiTableData());
          if(callback) callback();
        }}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect }}
        onRenderFullField={mapFields}
      />
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...boxes, ...notifications }, dispatch);

export default connect(null, mapDispatchToProps)(Position);
