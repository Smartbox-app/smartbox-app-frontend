import React, { useState } from 'react';
import styled from 'styled-components';

import { resolveInputSize } from 'src/components/Common/input-sizes';
import { StyledTextInput } from 'src/components/Common/input-styled';
import { ButtonsContainer } from 'src/components/Layout';
import { Typography, Button } from 'src/components/ui';
import { ErrorText } from 'src/components/ui/ErrorText';
import { InputLabel } from 'src/components/ui/InputLabel';
import { __ } from 'src/helpers/i18n';
import { Add } from 'src/icons';
import { errors } from 'src/validation/errors';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parseEmailTokens = (text: string): string[] => {
  const normalized = text
    .replace(/\r\n/g, '\n')
    .split(/[,;\n]+/)
    .flatMap((part) => part.split(/\s+/))
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(normalized)];
};

const Field = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  width: '100%',
}));

const DraftInputWrap = styled('div')({
  flex: 1,
  minWidth: 200,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const EmailList = styled('ul')(({ theme }) => ({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing,
  border: `1px solid ${theme.colors.border.primary}`,
  borderRadius: theme.radius.innerSurface,
  background: theme.colors.background.white,
  overflow: 'hidden',
}));

const EmailListItem = styled('li')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing * 2,
  padding: `${theme.spacing * 2}px ${theme.spacing * 3}px`,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.colors.text.primary,
  borderBottom: `1px solid ${theme.colors.border.primary}`,

  '&:last-child': {
    borderBottom: 'none',
  },
}));

const EmailAddress = styled('span')({
  wordBreak: 'break-all',
});

type Props = {
  name: string;
  value: string[];
  onChange: (emails: string[]) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
};

export const InviteEmailsField = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: Props) => {
  const inputSize = resolveInputSize({});
  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState<string | undefined>();

  const emails = value ?? [];

  const addEmailsFromText = (text: string) => {
    const tokens = parseEmailTokens(text);
    if (tokens.length === 0) {
      setDraftError(errors.field_required);
      return;
    }

    const valid = tokens.filter((token) => EMAIL_PATTERN.test(token));
    const invalid = tokens.filter((token) => !EMAIL_PATTERN.test(token));
    const next = [...emails];
    let added = 0;

    for (const email of valid) {
      if (!next.includes(email)) {
        next.push(email);
        added++;
      }
    }

    if (added === 0 && valid.length > 0) {
      setDraftError('application.inviteUsersEmailDuplicate');
      return;
    }

    if (added === 0) {
      setDraftError(errors.incorrect_email);
      return;
    }

    onChange(next);
    setDraft('');
    setDraftError(invalid.length > 0 ? errors.incorrect_email : undefined);
    onBlur?.();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text');
    if (!/[,;\n\r]/.test(pasted) && !/\s.+@/.test(pasted)) {
      return;
    }

    event.preventDefault();
    addEmailsFromText(pasted);
  };

  const removeEmail = (email: string) => {
    onChange(emails.filter((item) => item !== email));
    onBlur?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addEmailsFromText(draft);
    }
  };

  return (
    <Field>
      <InputLabel labelFor={`${name}-draft`} required>
        {__('application.inviteUsersEmails')}
      </InputLabel>

      <DraftInputWrap>
        <StyledTextInput
          id={`${name}-draft`}
          name={`${name}-draft`}
          type="text"
          $size={inputSize}
          $error={!!draftError}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            if (draftError) setDraftError(undefined);
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder={__('application.inviteUsersEmailsPlaceholder')}
          autoComplete="off"
        />
        {draftError ? <ErrorText error={draftError} /> : null}
        {error ? <ErrorText error={error} /> : null}
      </DraftInputWrap>
      <ButtonsContainer>
        <Button
          type="button"
          onClick={() => addEmailsFromText(draft)}
          disabled={disabled}
          iconLeft={<Add />}
          text="application.inviteUsersAddEmail"
        />
      </ButtonsContainer>

      {emails.length > 0 ? (
        <>
          <Typography>
            {__('application.inviteUsersEmailsList')} ({emails.length})
          </Typography>
          <EmailList>
            {emails.map((email) => (
              <EmailListItem key={email}>
                <EmailAddress>{email}</EmailAddress>
                <Button
                  type="button"
                  text="application.delete"
                  variant="error"
                  size="small"
                  onClick={() => removeEmail(email)}
                  disabled={disabled}
                />
              </EmailListItem>
            ))}
          </EmailList>
        </>
      ) : null}
    </Field>
  );
};
