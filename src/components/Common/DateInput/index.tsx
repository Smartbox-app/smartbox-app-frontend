import React from 'react';
import Flatpickr from 'react-flatpickr';
import { useForm, useFormContext } from 'react-hook-form';
import flatpickr from 'flatpickr'; // Check out other cool Themes: https://flatpickr.js.org/themes/
import 'flatpickr/dist/themes/airbnb.css';

import './DateInput.scss';
import { Polish } from 'flatpickr/dist/l10n/pl';
import { format } from 'date-fns';

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
}

const DateInput = ({ name, value, onChange, label, minDate, maxDate, register }: Props) => {
  const { errors } = useForm();
  // const { register } = useFormContext();
  const setDefaultVaule = (data: any) => {
    if (data[0]) {
      return format(data[0], 'yyyy-MM-dd');
    } else {
      return format(data, 'yyyy-MM-dd');
    }
  };

  return (
    <div className="data-picker-wrapper">
      {label && <label htmlFor={name}>{label}</label>}
      <Flatpickr
        name={name}
        ref={register}
        onChange={(data: any) => {
          onChange(data);
        }}
        defaultValue={setDefaultVaule(value)}
        options={{
          allowInput: false,
          inline: true,
          enableTime: false,
          locale: 'pl',
          minDate,
          maxDate,
        }}
      />
      <span>{errors[name]}</span>
    </div>
  );
};

export default DateInput;
