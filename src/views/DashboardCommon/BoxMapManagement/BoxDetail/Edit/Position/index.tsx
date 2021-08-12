import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import { connect } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { ChangeStatusReq, StockList } from 'smartbox-types';
import { boxes, modal, notifications } from '../../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../../components/Layout';
import { Alert, Button, Spinner } from '../../../../../../components/Common';
import { ApplicationState } from '../../../../../../reducers';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { __ } from '../../../../../../helpers/i18n';

import './Position.scss';

interface Props {
  rentId: string;
  stock: StockList;
  hideModal: () => void;
  successNotification: (text: string) => void;
  fetchBoxStatuses: (stockId: string) => void;
  showModal: (content: React.ReactNode) => void;
}

const Position = ({ rentId, stock, successNotification, fetchBoxStatuses, hideModal, showModal }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text={__('application.move')} type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = `rent/form/change-user-box/${rentId}`;
  const sendUrl = `rent/user-box/${rentId}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) => {
    showModal(
      <>
        <div className="modal-alert-wrapper">
          <Alert type="primary" text={__('application.userWillGetMailWithInformation')} />
          <Alert type="primary" text={__('application.actionCanNotBeUnDone')} />
        </div>
        <ButtonsContainer max>
          <Button text={__('application.cancel')} danger click={() => hideModal()} />
          <Button
            success
            type="submit"
            text={__('application.understood')}
            click={async () => {
              await hideModal();
              await ApiService.sendForm(
                sendUrl,
                {
                  ...values,
                },
                'PATCH',
              );
              await successNotification(__('notification.userMovedSuccess'));
              await fetchBoxStatuses(stock.id);
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
          fetchBoxStatuses(stock.id);
        }}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
      />
    </FormContainer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  stock: state.stock.list[0],
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...boxes, ...notifications }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Position);
