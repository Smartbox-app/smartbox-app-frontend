import React from 'react';
import { ErrorMessage } from 'react-hook-form';
import { __ } from '../../../helpers/i18n';

import './CustomInput.scss';
import styled from 'styled-components';
import { InputLabel } from '../InputLabel';

const StyledContainer = styled.div`
    .input {
    border: none;
        border-bottom: 2px solid ${props => props.theme.colors.primary};
    }
`


interface Props {
  register: any;
  errors: any;
  id: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

const CustomInput = ({ register, errors, id, type, placeholder, disabled }: Props) => {
  const containerClass = `input-container`;


  return (

    <StyledContainer className={containerClass}>
      <InputLabel label={__(`application.${id}`)} name={id} />
      <div className="input-wrapper">
        <input
          className={`input`}
          type={`${type || 'text'}`}
          id={id}
          name={id}
          ref={register}
          placeholder={placeholder || __(`application.${id}`)}
          disabled={disabled}
          onChange={e => console.log('change', e.target.value)}
        />
      </div>
      <ErrorMessage errors={errors} name={id} />
    </StyledContainer>

    // <label htmlFor="form-field" title={id} className="custom-input">
    //   <p className="label">{__(`application.${id}`)}:</p>
    //   <input
    //     type={`${type || 'text'}`}
    //     id={id}
    //     name={id}
    //     ref={register}
    //     placeholder={placeholder || __(`application.${id}`)}
    //     disabled={disabled}
    //   />
    //   <div className="form-field-errors">
    //     <ErrorMessage errors={errors} name={id} />
    //   </div>
    // </label>
  );
};

export default CustomInput;
