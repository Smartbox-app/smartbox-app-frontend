import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { hideModal } from 'src/actions/modal';
import { successNotification } from 'src/actions/notifications';
import { Button, Modal, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

type ApiKeyCreatedModalProps = {
  apiKey: string;
  name: string;
  rotated?: boolean;
};

const StyledKey = styled.pre(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  padding: theme.spacing * 3,
  borderRadius: theme.radius.innerSurface,
  overflow: 'auto',
  fontFamily: 'monospace',
  fontWeight: 700,
  margin: 0,
  wordBreak: 'break-all',
  whiteSpace: 'pre-wrap',
}));

export const ApiKeyCreatedModal = ({ apiKey, name, rotated }: ApiKeyCreatedModalProps) => {
  const dispatch = useDispatch();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    dispatch(successNotification(__('application.apiAccessCopied')));
  };

  return (
    <>
      <Modal.Header
        title={__(
          rotated
            ? 'application.apiAccessRotated'
            : 'application.apiAccessCreated',
        )}
      />
      <Modal.Content>
        <Typography>{__('application.apiAccessCreatedText')}</Typography>
        <Typography>
          <strong>{name}</strong>
        </Typography>
        <StyledKey>{apiKey}</StyledKey>
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="button"
          variant="secondary"
          text="application.apiAccessCopy"
          onClick={handleCopy}
        />
        <Button
          type="button"
          variant="primary"
          text="application.apiAccessOk"
          onClick={() => dispatch(hideModal())}
        />
      </Modal.Actions>
    </>
  );
};
