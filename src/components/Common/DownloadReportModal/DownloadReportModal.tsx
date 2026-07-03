import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { subDays } from 'date-fns';
import DateInput from 'src/components/Common/DateInput';
import { Spinner } from 'src/components/Branded';
import { Button, Modal, Typography } from 'src/components/ui';
import { ButtonsContainer } from 'src/components/Layout';
import { hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';
import { __ } from 'src/helpers/i18n';
import { dateOnlyNormalized } from 'src/utils/format-date';
import styled from 'styled-components';

const StyledContent = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
}));

export type ReportType = 'rent' | 'payment';

export type DownloadReportModalProps = {
  reportType: ReportType;
};

export const DownloadReportModal = ({ reportType }: DownloadReportModalProps) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState<Date>(subDays(new Date(), 1));
  const [isLoading, setIsLoading] = useState(false);

  const endpoint =
    reportType === 'rent' ? 'rent/report' : 'payment/report';

  const title =
    reportType === 'rent'
      ? __('application.downloadReport')
      : __('application.downloadPaymentsReport');

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await ApiService.callFetch(
        'GET',
        `${endpoint}?date=${dateOnlyNormalized(selectedDate)}`,
        () => {
          dispatch(successNotification(__('application.reportQueuedForEmail')));
          dispatch(hideModal());
        },
        undefined,
        undefined,
        undefined,
        true,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal.Header title={title} />
      <Modal.Content>
        {isLoading ? <Spinner overlay halfTransparent /> : null}
        <StyledContent>
          <Typography>{__('application.reportWillBeSentToEmail')}</Typography>
          <DateInput
            name="reportDate"
            label="application.selectReportDate"
            value={selectedDate}
            maxDate={new Date()}
            inline={false}
            onChange={([selected]) => {
              if (selected) setSelectedDate(selected);
            }}
          />
        </StyledContent>
      </Modal.Content>
      <Modal.Actions>
        <ButtonsContainer>
          <Button
            variant="secondary"
            text={__('application.cancel')}
            onClick={() => dispatch(hideModal())}
            type="button"
          />
          <Button
            disabled={isLoading}
            variant="primary"
            text={title}
            onClick={() => void handleSubmit()}
            type="button"
          />
        </ButtonsContainer>
      </Modal.Actions>
    </>
  );
};
