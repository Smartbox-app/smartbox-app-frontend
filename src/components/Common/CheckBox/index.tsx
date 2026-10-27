import React from 'react';
import styled from 'styled-components';

import { InputErrors } from 'src/components/Common/InputErrors';
import { InputHelp } from 'src/components/Common/InputHelp';
import { __ } from 'src/helpers/i18n';
import { getColorForBackground } from 'src/utils/color';
import { TranslatableObject } from 'src/utils/errors-trans';

import 'src/components/Common/CheckBox/CheckBox.scss';

interface Props {
  name: string;
  checked: boolean;
  handleChange: (checked: boolean) => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
  errors?: TranslatableObject[];
  hide?: boolean;
  help?: string;
}

const StyledCheckbox = styled.div`
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

`;

const CheckBox = ({
  label,
  name,
  checked,
  handleChange,
  disabled,
  help,
  errors,
  hide,
}: Props) => (
  <StyledCheckbox
    className={`checkbox ${disabled ? 'checkbox-disabled' : ''} ${hide && 'checkbox-hide'}`}
  >
    <input
      type="checkbox"
      id={name}
      name={name}
      onChange={(event) => handleChange(event.target.checked)}
      checked={!!checked}
      disabled={disabled}
    />
    <label htmlFor={name}>{label}</label>
    {errors && <InputErrors errors={errors} />}
    {help && <InputHelp text={help} />}
  </StyledCheckbox>
);

export default CheckBox;
