import React, { Component } from 'react';
import DatePicker from 'react-date-picker';

import './DateInput.scss';

interface Props {
  name: string;
  value?: Date[] | Date;
}

export default class DateInput extends Component<Props> {
  state = {
    date: new Date(),
  };

  onChange = (date: any) => {
    this.setState({ date });
  };

  render() {
    const { name, value } = this.props;
    const { date } = this.state;
    return (
      <DatePicker
        onChange={this.onChange}
        value={value || date}
        className="date-input-style"
        format="dd-MM-y"
        name={name}
      />
    );
  }
}
