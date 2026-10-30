import { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styled from 'styled-components';

import {
  getInputFieldStyles,
  InputSize,
  InputSizeProps,
  resolveInputSize,
} from 'src/components/Common/input-sizes';
import { ErrorText } from 'src/components/ui/ErrorText';
import { InputLabel } from 'src/components/ui/InputLabel';
import { Typography } from 'src/components/ui/Typography';
import { __ } from 'src/helpers/i18n';

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

const StyledInput = styled('input')<{
  $size: InputSize;
  $error: boolean;
  $disabled: boolean;
}>(({ theme, $size, $error, $disabled }) =>
  getInputFieldStyles(theme, $size, { error: $error, disabled: $disabled }),
);

export type InputProps = {
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
  help?: string;
  value?: string;
  defaultValue?: string;
  autoComplete?: string;
} & InputSizeProps &
  UseFormRegisterReturn;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      placeholder,
      error,
      help,
      disabled,
      type = 'text',
      name,
      value,
      defaultValue,
      autoComplete,
      size,
      big,
      compact,
      ...register
    },
    ref,
  ) => {
    const resolvedSize = resolveInputSize({ size, big, compact });

    return (
      <StyledContainer>
        <InputLabel required={register.required} labelFor={name}>
          {__(label)}
        </InputLabel>
        <StyledInput
          {...register}
          disabled={!!disabled}
          $size={resolvedSize}
          $error={!!error}
          $disabled={!!disabled}
          name={name}
          id={name}
          ref={ref}
          type={type}
          value={value}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          placeholder={placeholder ? __(placeholder) : ''}
        />
        {error ? <ErrorText error={error} /> : null}
        {help ? <StyledHelp>{__(help)}</StyledHelp> : null}
      </StyledContainer>
    );
  },
);

Input.displayName = 'Input';

export type { InputSize };
