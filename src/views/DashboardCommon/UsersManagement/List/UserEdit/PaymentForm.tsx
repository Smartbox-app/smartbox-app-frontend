import { ItfApiForm } from 'itf_formbuilder_react';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

import { UpdateSomeonePaymentReq, PaymentDeadlineChange } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button, Spinner } from 'src/components/Branded';
import { ButtonsContainer, FieldsColumn } from 'src/components/Layout';
import ApiService from 'src/services/api-service';
import { mapFields } from 'src/utils/fields-mapper';
import { formOnTranslateString } from 'src/utils/trans-form';

import {
  PaymentDeadlinePreviewModal,
} from './components/PaymentDeadlinePreviewModal';

type PaymentFormProps = {
  userId: string;
  onSaved: () => void;
  onReturnToPayment: () => void;
};

type FormField = { id: string; value?: number | null };

const paymentDays = (value: unknown) => {
  if (value == null || value === '') return null;
  const days = Number(value);
  return Number.isInteger(days) && days >= 1 ? days : null;
};

const submitButton = (
  <ButtonsContainer>
    <Button text="application.save" type="submit" primary />
  </ButtonsContainer>
);

export const PaymentForm = ({
  userId,
  onSaved,
  onReturnToPayment,
}: PaymentFormProps) => {
  const dispatch = useDispatch();
  const initialDays = useRef({
    installment: null as number | null,
    openEnded: null as number | null,
  });
  const fetchUrl = `user/form/update-user/${userId}/payment`;
  const sendUrl = `user/someone/${userId}/payment`;

  const schemaFetcher = async () => {
    const schema = await ApiService.loadForm(fetchUrl);
    if (!Array.isArray(schema)) return schema;
    const fields = schema as FormField[];
    const field = (id: string) => fields.find((item) => item.id === id);
    initialDays.current = {
      installment: paymentDays(field('daysForPayment')?.value),
      openEnded: paymentDays(field('openEndedDaysForPayment')?.value),
    };
    return schema;
  };

  const customSendFetcher = async (
    _formId: string,
    values: UpdateSomeonePaymentReq,
  ) => {
    const installment = paymentDays(values.daysForPayment);
    const openEnded = paymentDays(values.openEndedDaysForPayment);
    const deadlinesChanged =
      installment !== initialDays.current.installment ||
      openEnded !== initialDays.current.openEnded;

    if (deadlinesChanged) {
      const preview = await ApiService.callFetch<{ changes: PaymentDeadlineChange[] }>(
        'POST',
        `user/someone/${userId}/payment-deadline-preview`,
        null,
        null,
        {
          daysForPayment: installment,
          openEndedDaysForPayment: openEnded,
        },
      );
      if (!preview) throw new Error('preview');
      if (preview.changes.length) {
        const handleConfirmed = () => {
          onSaved();
          onReturnToPayment();
        };
        dispatch(
          showModal(
            <PaymentDeadlinePreviewModal
              userId={userId}
              values={values}
              changes={preview.changes}
              onSaved={handleConfirmed}
            />,
          ),
        );
        throw new Error('confirm');
      }
    }

    return ApiService.sendForm(sendUrl, values, 'PATCH');
  };

  return (
    <FieldsColumn>
      <ItfApiForm
        formId="editUserPayment"
        schemaMayBeDynamic={false}
        schemaCacheEnabled={false}
        loadingInfo={<Spinner transparent />}
        schemaFetcher={schemaFetcher}
        sendFetcher={customSendFetcher}
        submitButton={submitButton}
        onRenderFullField={mapFields}
        onSavedSuccessfully={onSaved}
        onTranslateString={formOnTranslateString}
      />
    </FieldsColumn>
  );
};
