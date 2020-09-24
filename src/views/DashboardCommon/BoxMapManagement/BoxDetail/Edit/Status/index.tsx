import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import { connect } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { ChangeStatusReq, StockList } from 'smartbox-types';
import { modal } from '../../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../../components/Layout';
import { Button } from '../../../../../../components/Common';
import { ApplicationState } from '../../../../../../reducers';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { successNotification } from '../../../../../../actions/notifications';
import { __ } from '../../../../../../helpers/i18n';

import './Status.scss';

interface Props {
  selectedBoxId: string;
  hideModal: () => void;
  stock: StockList;
}

const Status = ({ selectedBoxId, hideModal, stock }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text={__('application.changeStatus')} type="submit" danger />
    </ButtonsContainer>
  );

  const fetchUrl = 'rent/form/change-status';
  const sendUrl = `rent/status/${stock.id}`;

  const customSendFetcher = (formId: string, values: ChangeStatusReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        number: selectedBoxId,
      },
      'PATCH',
    );

  return (
    <FormContainer className="box-status-form">
      <ItfApiForm
        formId="box-status-form"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onSavedSuccessfully={() => {
          hideModal();
          successNotification(__('notification.userStatusChanged'));
        }}
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

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Status);
