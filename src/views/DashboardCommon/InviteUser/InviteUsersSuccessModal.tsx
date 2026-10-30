import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import type { InviteUsersRes } from 'smartbox-types';
import { hideModal } from 'src/actions/modal';
import { Button, Header, Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { currentAppLanguage } from 'src/i18n/app-language';
import { translateApiErrorCode } from 'src/utils/trans-form';

const List = styled('ul')({
  margin: 0,
  padding: 0,
  textAlign: 'left',
});

const FailedItem = styled('li')(({ theme }) => ({
  marginBottom: theme.spacing,
}));

type Props = {
  result: InviteUsersRes;
};

export const InviteUsersSuccessModal = ({ result }: Props) => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideModal());
  };

  const hasInvited = result.invited.length > 0;
  const hasFailed = result.failed.length > 0;

  return (
    <>
      <Modal.Header title={__('application.inviteUsersResultTitle')} />
      <Modal.Content>
        {hasInvited ? (
          <div>
            <Header variant="h3">{__('application.inviteUsersInvited')}</Header>
            <List>
              {result.invited.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </List>
          </div>
        ) : null}

        {hasFailed ? (
          <div>
            <Header variant="h3">{__('application.inviteUsersFailed')}</Header>
            <List>
              {result.failed.map(({ email, errorCode }) => (
                <FailedItem key={email}>
                  <strong>{email}</strong> —{' '}
                  {translateApiErrorCode(errorCode, currentAppLanguage())}
                </FailedItem>
              ))}
            </List>
          </div>
        ) : null}
      </Modal.Content>
      <Modal.Actions>
        <Button text="application.back" onClick={handleClose} />
      </Modal.Actions>
    </>
  );
};
