import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import { connect } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { ChangeStatusReq, StockList } from 'smartbox-types';
import { boxes, modal, notifications, stock } from '../../../../../../actions';
import { FormContainer, ButtonsContainer, SimpleHeader } from '../../../../../../components/Layout';
import { Alert, Button, Spinner } from '../../../../../../components/Common';
import { ApplicationState } from '../../../../../../reducers';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { __ } from '../../../../../../helpers/i18n';

import './Status.scss';

interface Props {
  selectedBoxId: string;
  stock: StockList;
  hideModal: () => void;
  successNotification: (text: string) => void;
  fetchBoxStatuses: (stockId: string) => void;
  showModal: (content: React.ReactNode) => void;
}

const Status = ({ selectedBoxId, hideModal, stock, successNotification, fetchBoxStatuses, showModal }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text={__('application.changeStatus')} type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = 'rent/form/change-status';
  const sendUrl = `rent/status/${stock.id}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) => {
    console.log('ChangeStatusReq', values);
    showModal(
      <>
        {values.status === null || values.status.length === 0 ? (
          <Alert type="error" text="Nie wybrałeś statusu" />
        ) : (
          <div className="modal-alert-wrapper">
            <Alert type="warning" text={__('application.userWillNotGetMailWithInformation')} />
            <Alert type="primary" text={__('application.actionCanNotBeUnDone')} />
          </div>
        )}

        <ButtonsContainer>
          <Button text={__('application.cancel')} danger click={() => hideModal()} />
          <Button
            success
            type="submit"
            text={__('application.understood')}
            disabled={values.status === null || values.status.length === 0}
            click={async () => {
              await hideModal();
              await ApiService.sendForm(
                sendUrl,
                {
                  ...values,
                  number: selectedBoxId,
                },
                'PATCH',
              );
              await successNotification(__('notification.userStatusChanged'));
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
        formId="box-status-form"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        loadingInfo={<Spinner transparent />}
        onTranslateString={formOnTranslateString}
        thirdPartyComponents={{ ReactSelect, ReactCreatableSelect }}
      />
    </FormContainer>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  stockId: state.rent.stockId,
  stock: state.stock.list[0],
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ ...stock, ...modal, ...notifications, ...boxes }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Status);
