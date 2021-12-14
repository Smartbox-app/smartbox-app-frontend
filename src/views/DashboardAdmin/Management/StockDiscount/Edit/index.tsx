import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { DiscountReq } from 'smartbox-types';
import { addMinutes } from 'date-fns';
import { connect } from 'react-redux';
import flatpickr from 'flatpickr';
import { bindActionCreators } from 'redux';
import { FormContainer, ButtonsContainer, FieldsColumn } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Common';
import FormHeader from '../../../../../components/Layout/FormHeader';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { apiTable, modal, notifications } from '../../../../../actions';
import { __ } from '../../../../../helpers/i18n';

interface Props {
  discountId: string;
  hideModal: () => void;
  refreshApiTableData: () => void;
  successNotification: (text: string) => void;
}

const Edit = ({ discountId, successNotification, hideModal, refreshApiTableData }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text='application.save' type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = `stock/form/update-stock-discount/${discountId}`;
  const sendUrl = `stock/discount/${discountId}`;

  const customSendFetcher = (formId: string, values: DiscountReq) => {
    console.log(values);
    return ApiService.sendForm(
      sendUrl,
      {
        ...values,
        expireAt: addMinutes(new Date(values.expireAt), 1439),
      },
      'PATCH',
    );
  };
  return (
    <FormContainer>
      <FormHeader title='application.editStockDiscount' />
      <FieldsColumn>
        <ItfApiForm
          formId="editStockDiscountForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            successNotification('application.changesSavedSuccess');
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
      ...notifications,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Edit);
