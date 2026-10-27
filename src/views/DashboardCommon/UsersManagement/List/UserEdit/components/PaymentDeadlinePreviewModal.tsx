import React, { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { PaymentDeadlineChange, UpdateSomeonePaymentReq } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { Alert } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { Header, Modal, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { currentAppLanguage } from 'src/i18n/app-language';
import ApiService from 'src/services/api-service';
import { BCP47_LOCALE } from 'src/utils/country-locale';
import UserEdit from 'src/views/DashboardCommon/UsersManagement/List/UserEdit';

type Props = {
  userId: string;
  values: UpdateSomeonePaymentReq;
  changes: PaymentDeadlineChange[];
  onSaved: () => void;
};

const daysLabel = (days: number | null) =>
  days == null ? __('application.warehousePaymentTerm') : String(days);

const formatDay = (value: string | Date) =>
  new Date(value).toLocaleDateString(BCP47_LOCALE[currentAppLanguage()]);

const ChangeLine = styled.li`
  display: grid;
  grid-template-columns: 1.5fr 2fr;
`;

export const PaymentDeadlinePreviewModal = ({
  userId,
  values,
  changes,
  onSaved,
}: Props) => {
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  const handleProceed = async () => {
    setSaving(true);
    try {
      await ApiService.sendForm(
        `user/someone/${userId}/payment`,
        values,
        'PATCH',
      );
      onSaved();
    } catch {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    dispatch(showModal(<UserEdit userId={userId} initialSection="payment" />));
  };

  return (
    <>
      <Modal.Header title={__('application.paymentDeadlineChange')} />
      <Modal.Content>
        {changes.map((change) => (
          <Fragment key={change.label}>
            <Header variant="h3">{change.label}</Header>
            <Typography>
              {__('application.periodChangeFromTo', {
                from: daysLabel(change.previousDays),
                to: daysLabel(change.nextDays),
              })}
            </Typography>
            {change.periods.length === 0 ? (
              <Alert type="notice">
                {__('application.noPeriodWillChangePaymentTerm')}
              </Alert>
            ) : (
              <ul>
                {[...change.periods]
                  .sort(
                    (a, b) =>
                      new Date(a.startAt).getTime() -
                      new Date(b.startAt).getTime(),
                  )
                  .map((period) => (
                    <ChangeLine key={`${period.rentNumber}-${period.startAt}`}>
                      <span>
                        <strong>
                          {__('application.shortenNumber')} {period.rentNumber}
                        </strong>{' '}
                        {__('application.periodStartAt', {
                          date: formatDay(period.startAt),
                        })}{' '}
                      </span>
                      {formatDay(period.paymentTo)} →{' '}
                      {formatDay(period.nextPaymentTo)}{' '}
                    </ChangeLine>
                  ))}
              </ul>
            )}
          </Fragment>
        ))}
      </Modal.Content>
      <Modal.Actions>
        <ButtonsContainer>
          <Button
            text="application.cancel"
            type="button"
            disabled={saving}
            click={handleCancel}
          />
          <Button
            text="application.save"
            type="button"
            primary
            disabled={saving}
            click={handleProceed}
          />
        </ButtonsContainer>
      </Modal.Actions>
    </>
  );
};
