import React from 'react';

import './CheckBox.scss';

interface Props {
  name: string;
  checked: boolean;
  handleChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const CheckBox = ({ label, name, checked, handleChange, disabled }: Props) => (
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
  </div>
);

export default CheckBox;
