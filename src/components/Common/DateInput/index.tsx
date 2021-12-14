import React from 'react';
import Flatpickr from 'react-flatpickr';
import { useForm } from 'react-hook-form';
import flatpickr from 'flatpickr'; // Check out other cool Themes: https://flatpickr.js.org/themes/
import { Polish } from 'flatpickr/dist/l10n/pl';

import 'flatpickr/dist/themes/airbnb.css';
import './DateInput.scss';
import {__} from "../../../helpers/i18n";

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

  return (
    <div className="data-picker-wrapper">
      {label && (
        <label htmlFor={name} className="data-picker-label">
          {__(label)}
        </label>
      )}
      <Flatpickr
        name={name}
        ref={register({ name })}
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
