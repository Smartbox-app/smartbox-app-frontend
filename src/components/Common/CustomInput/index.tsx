import React from 'react';
import { ErrorMessage } from 'react-hook-form';
import { __ } from '../../../helpers/i18n';

import './CustomInput.scss';

interface Props {
  register: any;
  errors: any;
  control: any;
  id: string;
  type?: string;
}

const CustomInput = ({ register, errors, control, id, type }: Props) => {
  console.log('CustomInput', errors)
  return (
    <label htmlFor="form-field" title={id} className="custom-input">
      <p className="label">{__(`application.${id}`)}:</p>
      <input type={`${type || 'text'}`} id={id} name={id} ref={register} placeholder={__(`application.${id}`)} />
      <div className="form-field-errors">
        <ErrorMessage errors={errors} name={id} />
      </div>
    </label>
  );
};

export default CustomInput;
