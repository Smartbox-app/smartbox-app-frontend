import React from 'react';
import { ErrorMessage } from 'react-hook-form';
import { __ } from '../../../helpers/i18n';

import './CustomInput.scss';

interface Props {
  register: any;
  errors: any;
  control: any;
  id: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

const CustomInput = ({ register, errors, control, id, type, placeholder, disabled }: Props) => {
  return (
    <label htmlFor="form-field" title={id} className="custom-input">
      <p className="label">{__(`application.${id}`)}:</p>
      <input
        type={`${type || 'text'}`}
        id={id}
        name={id}
        ref={register}
        placeholder={placeholder || __(`application.${id}`)}
        disabled={disabled}
      />
      <div className="form-field-errors">
        <ErrorMessage errors={errors} name={id} />
      </div>
    </label>
  );
};

export default CustomInput;
