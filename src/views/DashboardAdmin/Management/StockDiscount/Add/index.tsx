import React from 'react';
import { ItfApiForm } from 'itf_formbuilder_react';
import ReactSelect from 'react-select';
import ReactCreatableSelect from 'react-select/creatable';
import { AddGiftReq, GiftRes } from 'smartbox-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import flatpickr from 'flatpickr';
import { Polish } from 'flatpickr/dist/l10n/pl';
import { FormContainer, ButtonsContainer } from '../../../../../components/Layout';
import { Button, Spinner } from '../../../../../components/Common';
import ApiService from '../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../utils/trans-form';
import { successNotification } from '../../../../../actions/notifications';
import { modal } from '../../../../../actions';
import { __ } from '../../../../../helpers/i18n';

import './Add.scss';
import { history } from '../../../../../App';

interface Props {
  showModal: (content: React.ReactNode) => void;
}

const FormStockDiscount = ({ showModal }: Props) => {
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
    <>
      <ButtonsContainer>
        <Button to="/admin/management/stock-discount/list" text={__('application.back')} primary />
      </ButtonsContainer>
      <FormContainer className="gift-form">
        <ItfApiForm
          formId="addGiftForm"
          schemaMayBeDynamic={false}
          schemaCacheEnabled={false}
          loadingInfo={<Spinner transparent />}
          schemaFetcher={() => ApiService.loadForm(fetchUrl)}
          sendFetcher={customSendFetcher}
          submitButton={submitButton}
          onSavedSuccessfully={() => {
            successNotification(__('notification.discCodeCreated'));
            history.push('/admin/management/stock-discount/list');
          }}
          onTranslateString={formOnTranslateString}
          thirdPartyComponents={{ ReactSelect, ReactCreatableSelect, flatpickr }}
        />
      </FormContainer>
    </>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(FormStockDiscount);
