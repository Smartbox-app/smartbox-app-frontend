import { UseFormRegisterReturn } from 'react-hook-form';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { forwardRef } from 'react';
import { ErrorText } from '../ErrorText';
import { InputLabel } from '../InputLabel';
import { Typography } from '../Typography';

const StyledContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  width: '100%',
  position: 'relative',
}));

const StyledHelp = styled(Typography)({
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 400,
});

const StyledSelect = styled('select')<{ error: boolean; disabled: boolean }>(
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

export type SelectProps = {
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
  help?: string;
  options: string[] | { label: string; value: string }[];
} & UseFormRegisterReturn;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      placeholder,
      error,
      help,
      disabled,
      type = 'text',
      name,
      options,
      ...register
    },
    ref,
  ) => {
    return (
      <StyledContainer>
        <InputLabel labelFor={name}>{__(label)}</InputLabel>
        <StyledSelect
          {...register}
          disabled={!!disabled}
          error={!!error}
          name={name}
          id={name}
          ref={ref}
        >
          <option disabled value="">
            Wybierz
          </option>
          {options.map((option) => (
            <option
              key={typeof option === 'string' ? option : option.value}
              value={typeof option === 'string' ? option : option.value}
            >
              {typeof option === 'string' ? option : option.label}
            </option>
          ))}
        </StyledSelect>
        {error ? <ErrorText error={error} /> : null}
        {help ? <StyledHelp>{help}</StyledHelp> : null}
      </StyledContainer>
    );
  },
);
