import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { hideModal } from 'src/actions/modal';
import { Button, Modal, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { SuccessCheck } from 'src/icons';

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing * 4,
}));

type RentEndedSuccessModalProps =
  | {
      variant: 'scheduled';
      accessUntil: string;
    }
  | {
      variant: 'ended';
      requiresStaffCheck?: boolean;
    };

const SuccessBody = ({
  title,
  info,
}: {
  title: string;
  info: string;
}) => {
  const dispatch = useDispatch();

  return (
    <>
      <Modal.Header title={title} />
      <Modal.Content>
        <Content>
          <SuccessCheck />
          <Typography>{info}</Typography>
          <Button
            size="large"
            text="application.understood"
            onClick={() => dispatch(hideModal())}
          />
        </Content>
      </Modal.Content>
    </>
  );
};

export const RentEndedSuccessModal = (props: RentEndedSuccessModalProps) => {
  if (props.variant === 'scheduled') {
    return (
      <SuccessBody
        title={__('application.endOpenEndedRentalScheduledTitle')}
        info={__('application.endOpenEndedRentalScheduledInfo', {
          date: props.accessUntil,
        })}
      />
    );
  }

  const info = props.requiresStaffCheck
    ? __('application.rentEndedSuccessInfoWithPhoto')
    : __('application.rentEndedSuccessInfo');

  return (
    <SuccessBody title={__('application.rentEndedSuccessTitle')} info={info} />
  );
};
