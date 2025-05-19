import { useDispatch } from 'react-redux';
import { hideModal } from 'src/actions/modal';
import { Button, Header, Typography } from 'src/components/ui';
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

export const AccountRegisteredModal = () => {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(hideModal());
  };

  return (
    <Content>
      <SuccessCheck />
      <Header variant="h2">{__('application.thanksForRegister')}</Header>
      <Typography>{__('application.toEndRegisterVerifyMail')}</Typography>
      <Typography>{__('application.msgWasSentOnEmail')}</Typography>
      <Button size="large" text="application.backToApp" onClick={closeModal} />
    </Content>
  );
};
