import React from 'react';
import { useDispatch } from 'react-redux';
import { ItfApiForm } from 'itf_formbuilder_react';
import { GetGiftReq, GiftRes } from 'smartbox-types';
import { Button, Spinner } from '../../../../../../../components/Branded';
import { FormContainer, ButtonsContainer } from '../../../../../../../components/Layout';
import { notifications } from '../../../../../../../actions';
import FormHeader from '../../../../../../../components/Layout/FormHeader';
import ApiService from '../../../../../../../services/api-service';
import { formOnTranslateString } from '../../../../../../../utils/trans-form';
import { setDiscountCode } from '../../../../../../../actions/order';
import { hideModal } from '../../../../../../../actions/modal';


interface Props {
  stockId: string;
  rentStart: Date;
  rentEnd: Date;
}

const DiscountCode = ({ stockId, rentEnd, rentStart }: Props) => {
  const dispatch = useDispatch();

  const submitButton = (
    <ButtonsContainer>
      <Button text="application.save" type="submit" primary />
    </ButtonsContainer>
  );

  const fetchUrl = 'gift/form/get-gift-details';
  const sendUrl = `gift/details/${stockId}`;

  const customSendFetcher = (formId: string, values: GetGiftReq) =>
    ApiService.sendForm(
      sendUrl,
      {
        ...values,
        startDate: rentStart,
        endDate: rentEnd
      },
      'POST',
    );

  return (
    <FormContainer>
      <FormHeader title="application.passYourDiscountCode" />
      <ItfApiForm
        formId="getGiftForm"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner small />}
        schemaFetcher={() => ApiService.loadForm(fetchUrl)}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onSavedSuccessfully={(data: GiftRes) => {
          dispatch(notifications.successNotification('notification.discountCodeRead'));
          dispatch(setDiscountCode(data.code));
          dispatch(hideModal());

        }}
        onTranslateString={formOnTranslateString}
      />
    </FormContainer>
  );
};

export { DiscountCode }
