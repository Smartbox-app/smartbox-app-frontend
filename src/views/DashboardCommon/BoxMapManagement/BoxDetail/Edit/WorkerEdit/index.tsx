import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import { connect } from 'react-redux';
import ReactCreatableSelect from 'react-select/creatable';
import { bindActionCreators } from 'redux';
import { ChangeStatusReq } from 'smartbox-types';
import { modal, notifications } from '../../../../../../actions';
import { FormContainer, ButtonsContainer } from '../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../components/Common';
import { ApplicationState } from '../../../../../../reducers';
import ApiService from '../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../utils/trans-form';
import { __ } from '../../../../../../helpers/i18n';

interface Props {
  selectedBoxId: string;
  rentId: string;
  hideModal: () => void;
  successNotification: (text: string) => void;
}

const Status = ({ selectedBoxId, hideModal, successNotification, rentId }: Props) => {
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
        number: selectedBoxId,
      },
      'PATCH',
    );

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

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...modal, ...notifications }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Status);
