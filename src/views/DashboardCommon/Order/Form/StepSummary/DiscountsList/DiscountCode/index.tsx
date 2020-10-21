import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { GetGiftReq, GiftRes } from 'smartbox-types';
import { Button, Spinner } from '../../../../../../../components/Common';
import { FormContainer, ButtonsContainer } from '../../../../../../../components/Layout';
import { modal, notifications, order } from '../../../../../../../actions';
import FormHeader from '../../../../../../../components/Layout/FormHeader';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { __ } from '../../../../../../../helpers/i18n';

interface Props {
  hideModal: () => void;
  updateFormData: (data: any) => void;
  successNotification: (text: string) => void;
}

const DiscountCode = ({ hideModal, updateFormData, successNotification }: Props) => {
  const submitButton = (
    <ButtonsContainer>
      <Button text="Dodaj" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'gift/form/get-gift-details';
  const sendUrl = 'gift/details';

  const customSendFetcher = (formId: string, values: GetGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
      },
      'POST',
    );

  return (
    <FormContainer className="gift-form">
      <FormHeader title="Podaj Twój kod rabatowy" />
      <ItfApiForm
        formId="getGiftForm"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner small />}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onSavedSuccessfully={(data: GiftRes) => {
          successNotification(__('notification.discountCodeRead'));
          updateFormData({
            discountCode: data.code,
            card: {
              discount: data.discount,
              durationInWeeks: data.duration,
            },
          });
          hideModal();
        }}
        onErrorsWhileSaving={() => {
          hideModal();
        }}
        onTranslateString={formOnTranslateString}
      />
    </FormContainer>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...order,
      ...notifications,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(DiscountCode);
