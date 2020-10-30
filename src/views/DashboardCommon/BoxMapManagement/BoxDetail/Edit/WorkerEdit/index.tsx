import { ItfApiForm } from 'itf_formbuilder_react';
import React from 'react';
import { connect } from 'react-redux';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { ChangeStatusReq, RentStatus, StockList } from 'smartbox-types';
import { boxes, modal, notifications } from '../../../../../../actions';
import { Button, Spinner } from '../../../../../../components/Common';
import { ButtonsContainer, FormContainer } from '../../../../../../components/Layout';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';

interface Props {
  rentId: string;
  stock: StockList;
  hideModal: () => void;
  successNotification: (text: string) => void;
  fetchBoxStatuses: (stockId: string) => void;
  singleBoxDetailStatus: RentStatus;
}

const Status = ({ singleBoxDetailStatus, hideModal, successNotification, rentId, stock, fetchBoxStatuses }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text={__('application.changeStatus')} type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = 'rent/form/change-status-after-checked';
  const sendUrl = `rent/status-after-checked/${rentId}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        // number: selectedBoxId,
      },
      'PATCH',
    );

  if (rentId === '' || singleBoxDetailStatus === RentStatus.rented) {
    return <p>Nie możesz wykonywać akcji na tej skrytce!</p>;
  }

  return (
    <FormContainer className="box-status-form">
      <ItfApiForm
        formId="box-status-form-worker"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        loadingInfo={<Spinner transparent />}
        onSavedSuccessfully={() => {
          hideModal();
          successNotification(__('notification.userStatusChanged'));
          fetchBoxStatuses(stock.id);
        }}
        onErrorsWhileSaving={() => hideModal()}
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

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...boxes, ...modal, ...notifications }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Status);
