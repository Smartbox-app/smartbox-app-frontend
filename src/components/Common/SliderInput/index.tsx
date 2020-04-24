import React, { Component } from 'react';

import './SliderInput.scss';

interface Props {
  name: string;
  className?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  inputProps?: {};
  onChange?: () => void;
}

class SliderInput extends Component<Props> {
  state = {
    currentValue: 0,
  };

  onChange = (value: any) => {
    this.setState({ currentValue: value.target.value });
  };

  componentDidMount() {
    const { value, min } = this.props;
    this.setState({ currentValue: value || min || 50 });
  }

  render() {
    const { className, value, min, max, step, disabled, inputProps } = this.props;
    const { currentValue } = this.state;
    const inputEl = (
      <input
        type="range"
        className={className}
        value={currentValue || value || min}
        min={min}
        max={max}
        step={step}
        onChange={this.onChange.bind(this)}
        disabled={disabled}
        {...inputProps}
      />
    );

    return (
      <div className="slider-input-wrapper">
        <div>{inputEl}</div>
        <div>{currentValue}</div>
      </div>
    );
  }
}

export default SliderInput;
