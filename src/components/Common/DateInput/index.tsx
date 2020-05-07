import React from 'react';
import Flatpickr from 'react-flatpickr';
import { useForm } from 'react-hook-form';
import flatpickr from 'flatpickr'; // Check out other cool Themes: https://flatpickr.js.org/themes/
import 'flatpickr/dist/themes/airbnb.css';

import './DateInput.scss';
import { Polish } from 'flatpickr/dist/l10n/pl';

flatpickr.localize(Polish);
flatpickr.defaultConfig.time_24hr = true;

interface Props {
  name: string;
  value?: Date[] | Date;
  register?: any;
  required?: boolean;
  label?: string;
  onChange?: any;
  minDate?: any;
  maxDate?: any;
}

const DateInput = ({ name, value, register, required, onChange, label, minDate, maxDate }: Props) => {
  const { errors } = useForm();
  return (
    <div className="data-picker-wrapper">
      {label && <label htmlFor={name}>{label}</label>}
      <Flatpickr
        onChange={(data: any) => {
          onChange(data);
        }}
        value={value}
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
