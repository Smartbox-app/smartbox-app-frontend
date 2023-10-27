import React from 'react';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactCreatableSelect from 'react-select/creatable';
import { addMinutes } from 'date-fns';
import { DiscountReq } from 'smartbox-types';
import { connect } from 'react-redux';
import flatpickr from 'flatpickr';
import { FormContainer, ButtonsContainer, FieldsColumn } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Branded';
import FormHeader from '../../../../../components/Layout/FormHeader';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { apiTable, modal, notifications } from '../../../../../actions';
import { ReactSelectOverride } from '../../../../../components/Common/ReactSelectOverride';

interface Props {
  fetchApiTableData: (url: string) => void;
  hideModal: () => void;
  successNotification: (text: string) => void;
}

const FormStockDiscount = ({ fetchApiTableData, hideModal, successNotification }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="application.create" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'stock/form/add-stock-discount';
  const sendUrl = 'stock/discount';

  const customSendFetcher = (formId: string, values: DiscountReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        expireAt: addMinutes(values.expireAt, 1439),
      },
      'POST',
    );

  return (
    <FormContainer>
      <FormHeader title="application.creatStockDiscount" />
      <FieldsColumn>
        <ItfApiForm
          formId="addStockDiscountForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            hideModal();
            fetchApiTableData('stock/discount/list');
            successNotification('notification.stockDiscountCreated');
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect: ReactSelectOverride, ReactCreatableSelect, flatpickr }}
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
      ...notifications,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(FormStockDiscount);
