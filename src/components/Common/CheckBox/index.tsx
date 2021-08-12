import React from 'react';

import './CheckBox.scss';

interface Props {
  name: string;
  checked: boolean;
  handleChange: (checked: boolean) => void;
  label?: string | React.ReactNode;
  disabled?: boolean;
  errors?: any;
}

const CheckBox = ({ label, name, checked, handleChange, disabled, errors }: Props) => (
  <div className={`checkbox ${disabled ? 'checkbox-disabled' : ''}`}>
    <input
      type="checkbox"
      id={name}
      name={name}
      onChange={(e: any) => handleChange(e.target.value)}
      checked={!!checked}
      disabled={disabled}
    />
    <label htmlFor={name}>{label}</label>
    {errors &&
      errors.map((error: any) => (
        <small key={error} className="text-danger">
          {error.messageCompiled}
        </small>
      ))}
  </div>
);

export default CheckBox;
