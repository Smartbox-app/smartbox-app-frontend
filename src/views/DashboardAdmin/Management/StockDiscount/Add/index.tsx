import React from 'react';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { AddGiftReq, GiftRes } from 'smartbox-types';
import { connect } from 'react-redux';
import flatpickr from 'flatpickr';
import { FormContainer, ButtonsContainer, FieldsColumn } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Common';
import FormHeader from '../../../../../components/Layout/FormHeader';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { successNotification } from '../../../../../actions/notifications';
import { apiTable, modal } from '../../../../../actions';
import { __ } from '../../../../../helpers/i18n';

import './Add.scss';

interface Props {
  fetchApiTableData: (url: string) => void;
  hideModal: () => void;
}

const FormStockDiscount = ({ fetchApiTableData, hideModal }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="Utwórz" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'stock/form/add-stock-discount';
  const sendUrl = 'stock/discount';

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'POST',
    );

  return (
    <FormContainer className="gift-form">
      <FormHeader title="Tworzysz zniżkę" />
      <FieldsColumn>
        <ItfApiForm
          formId="addStockDiscountForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onSavedSuccessfully={(data: GiftRes) => {
            hideModal();
            fetchApiTableData('stock/discount/list')
            successNotification(__('notification.discCodeCreated'));
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect, flatpickr }}
        />
      </FieldsColumn>
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...apiTable,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(FormStockDiscount);
