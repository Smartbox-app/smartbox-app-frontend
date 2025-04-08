import { UseFormRegisterReturn } from 'react-hook-form';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { forwardRef } from 'react';
import { ErrorText } from '../ErrorText';
import { InputLabel } from '../InputLabel';

const StyledContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  width: '100%',
  position: 'relative',
}));

const StyledInput = styled('input')<{ error: boolean; disabled: boolean }>(
  ({ theme, disabled, error }) => ({
    fontSize: 14,
    lineHeight: '20px',
    color: theme.colors.text.primary,
    background: disabled
      ? theme.colors.border.disable
      : theme.colors.background.white,
    padding: `${theme.spacing * 3}px ${theme.spacing * 5}px`,
    border: `1px solid ${error ? theme.colors.danger : theme.colors.border.primary}`,
    borderRadius: theme.radius.outerSurface,
    height: theme.spacing * 12,
    '&::placeholder': {
      color: theme.colors.text.tertiary,
    },
    '&:focus': {
      borderColor: theme.colors.primary,
    },
  }),
);

export type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
} & UseFormRegisterReturn;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, placeholder, error, disabled, type = 'text', name, ...register },
    ref,
  ) => {
    return (
      <StyledContainer>
        <InputLabel labelFor={name}>{__(label)}</InputLabel>
        <StyledInput
          {...register}
          disabled={!!disabled}
          error={!!error}
          name={name}
          id={name}
          ref={ref}
          type={type}
          placeholder={placeholder ? __(placeholder) : ''}
        />
        {error ? <ErrorText error={error} /> : null}
      </StyledContainer>
    );
  },
);
