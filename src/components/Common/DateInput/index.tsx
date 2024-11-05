import React from 'react';
import Flatpickr from 'react-flatpickr';
import { useForm } from 'react-hook-form';
import flatpickr from 'flatpickr'; // Check out other cool Themes: https://flatpickr.js.org/themes/
import { Polish } from 'flatpickr/dist/l10n/pl';

import 'flatpickr/dist/themes/airbnb.css';
import './DateInput.scss';
import { __ } from "../../../helpers/i18n";
import styled from 'styled-components';
import { InputLabel } from '../InputLabel';
import { TranslatableObject } from '../../../utils/errors-trans';
import { InputErrors } from '../InputErrors';

flatpickr.localize(Polish);
flatpickr.defaultConfig.time_24hr = true;

interface Props {
  name: string;
  value?: Date[] | Date;
  label?: string;
  onChange?: any;
  minDate?: Date;
  maxDate?: Date;
  register?: any;
  inline?: boolean;
  big?: boolean;
  errors?: TranslatableObject[];
  noPadding?: boolean;
  required?: boolean;
}

const StyledContainer = styled.div <{ noPadding?: boolean }>`
padding: ${props => props.noPadding ? 0 : '10px'};
&.big {
  .flatpickr-input {
        border: 2px solid ${props => props.theme.colors.primary};
    }
}
&.compact {
  .flatpickr-input {
        border-bottom: 2px solid ${props => props.theme.colors.primary};
    }
}

.flatpickr-calendar {
  margin: 10px auto;
  }
`

const DateInput = ({ name, value, noPadding, onChange, label, errors, minDate, maxDate, big, register, required = true, inline = true }: Props) => {
  return (
    <StyledContainer noPadding={noPadding} className={`data-picker-wrapper ${big ? 'big' : 'compact'}`}>
      <InputLabel label={label} name={name} />
      <Flatpickr
        name={name}
        ref={register && register({ name })}
        onChange={(data: any) => {
          onChange(data);
        }}
        required={required}
        value={value}
        options={{
          allowInput: false,
          inline,
          enableTime: false,
          locale: 'pl',
          minDate,
          maxDate,
        }}
      />
      {errors && <InputErrors errors={errors} />}
    </StyledContainer>
  );
};

export default DateInput;
