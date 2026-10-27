import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import styled from 'styled-components';

import { AsterixRequired } from 'src/components/Common';
import { ErrorText } from 'src/components/ui/ErrorText';
import { __ } from 'src/helpers/i18n';
import { getColorForBackground } from 'src/utils/color';

import 'src/components/ui/Checkbox/CheckBox.scss';

export type CheckboxProps = {
  name: string;
  label?: string | React.ReactNode;
  disabled?: boolean;
  error?: string;
} & UseFormRegisterReturn;

const StyledCheckbox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => `${theme.spacing * 2}px`};
  [type='checkbox'] + label:before {
    border-radius: 4px;
  }

  [type='checkbox']:not(:checked) + label:before {
    border: 2px solid ${(props) => props.theme.colors.border.primary};
  }

  [type='checkbox']:checked + label:before {
    border: 2px solid ${(props) => props.theme.colors.primary};
    background: ${(props) => props.theme.colors.primary};
  }

  [type='checkbox']:checked + label:after,
  [type='checkbox']:not(:checked) + label:after {
    color: ${(props) => getColorForBackground(props.theme.colors.primary)};
  }

  [type='checkbox']:checked + label:after {
    content: '✓';
  }
`;

export const CheckBox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, name, disabled, error, ...register }, ref) => (
    <StyledCheckbox
      className={`checkbox ${disabled ? 'checkbox-disabled' : ''} `}
    >
      <div>
        <input
          {...register}
          type="checkbox"
          id={name}
          name={name}
          ref={ref}
          disabled={disabled}
        />
        <label htmlFor={name}>
          <div>
            {typeof label === 'string' ? __(label) : label}
            {register.required ? <>{' '}<AsterixRequired /></> : null}
          </div>
        </label>
      </div>
      {error ? <ErrorText error={error} /> : null}
    </StyledCheckbox>
  ),
);

CheckBox.displayName = 'CheckBox';
