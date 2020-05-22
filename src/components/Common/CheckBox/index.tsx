import React from 'react';

interface Props {
  name: string;
  checked: boolean;
  handleChange: (checked: boolean) => void;
  label?: string;
}

const CheckBox = ({ label, name, checked, handleChange }: Props) => (
  <div className="checkbox">
    <input
      type="checkbox"
      id={name}
      name={name}
      onChange={(e: any) => handleChange(e.target.value)}
      checked={!!checked}
    />
    <label htmlFor={name}>{label}</label>
  </div>
);

export default CheckBox;
