import { useDispatch } from 'react-redux';
import { hideModal } from 'src/actions/modal';
import { Button, Modal, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { SuccessCheck } from 'src/icons';
import styled from 'styled-components';

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  gap: theme.spacing * 4,
}));

type Props = {
  requiresStaffCheck?: boolean;
};

export const RentEndedSuccessModal = ({
  requiresStaffCheck = false,
}: Props) => {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(hideModal());
  };

  return (
    <>
      <Modal.Header title={__('application.rentEndedSuccessTitle')} />
      <Modal.Content>
        <Content>
          <SuccessCheck />
          <Typography>
            {__(
              requiresStaffCheck
                ? 'application.rentEndedSuccessInfoWithPhoto'
                : 'application.rentEndedSuccessInfo',
            )}
          </Typography>
          <Button
            size="large"
            text="application.understood"
            onClick={closeModal}
          />
        </Content>
      </Modal.Content>
    </>
  );
};
