import React from 'react';
import DatePicker from 'react-date-picker';
import { useForm } from 'react-hook-form';

import './DateInput.scss';

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
      <DatePicker
        onChange={onChange}
        value={value}
        className="date-input-style"
        format="dd-MM-y"
        name={name}
        required
        minDate={minDate || new Date()}
        maxDate={maxDate || null}
      />
      <span>{errors[name]}</span>
    </div>
  );
};

export default DateInput;
