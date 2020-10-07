import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { AddGiftReq, GiftRes } from 'smartbox-types';
import { connect } from 'react-redux';
import flatpickr from 'flatpickr';
import { bindActionCreators } from 'redux';
import { FormContainer, ButtonsContainer, FieldsColumn } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Common';
import FormHeader from '../../../../../components/Layout/FormHeader';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { successNotification } from '../../../../../actions/notifications';
import { apiTable, modal } from '../../../../../actions';
import { __ } from '../../../../../helpers/i18n';

import './Edit.scss';

interface Props {
  discoutnId: string;
  hideModal: () => void;
  refreshApiTableData: () => void;
  showModal: (content: React.ReactNode) => void;
}

const Edit = ({ discoutnId, showModal, hideModal, refreshApiTableData }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text={__('application.edit')} type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `stock/form/update-stock-discount/${discoutnId}`;
  const sendUrl = `stock/discount/${discoutnId}`;

  const customSendFetcher = (formId: string, values: AddGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'PATCH',
    );

  return (
    <FormContainer className="gift-form">
      <FormHeader title="Edytujesz zniżkę" />
      <FieldsColumn>
        <ItfApiForm
          formId="editStockDiscountForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onSavedSuccessfully={(data: GiftRes) => {
            successNotification(__('notification.discCodeCreated'));
            refreshApiTableData();
            hideModal();
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

export default connect(null, mapDispatchToProps)(Edit);
