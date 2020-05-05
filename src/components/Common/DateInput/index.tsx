import React, { Component } from 'react';
import DatePicker from 'react-date-picker';

import './DateInput.scss';

interface Props {
  name?: string;
  value?: Date[] | Date;
  register?: any;
  required?: boolean;
  errors?: any;
  label?: string;
  onChange?: any;
}

export default class DateInput extends Component<Props> {
  render() {
    const { name, value, errors, register, required, onChange } = this.props;

    return (
      <div className="data-picker-wrapper">
        <DatePicker
          onChange={onChange}
          value={value}
          className="date-input-style"
          format="dd-MM-y"
          name={name}
          required
        />
        {console.log('dateInput', errors)}
      </div>
    );
  }
}
