import * as React from 'react';
import './Input.scss';

interface Props {
  type: string;
  input: any;
  error?: any;
  errors?: any[];
  meta?: any;
  touched?: any;
  min?: number;
  max?: boolean;
  step?: number;
  value?: any;
  options?: any[];
  readonly?: boolean;
  required?: boolean;
  nomargin?: boolean;
  help?: string;
  onChange?: (value: string) => void;
  dark?: boolean;
  className?: string;
}

const errorClass = (errors: any[] | undefined) => (errors && errors.length ? 'is-invalid' : '');

const Input = (props: Props) => {
  const containerClass = `input-container ${props.className || ''} ${props.max ? 'input-max' : ''} ${
    props.nomargin ? 'nomargin' : ''
  } ${props.type === 'hidden' ? 'hidden' : ''}`;
  const label = props.input.label && <label htmlFor={props.input.name}>{props.input.label} </label>;
  if (props.type === 'select') {
    const options = props.options
      ? props.options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.name}
          </option>
        ))
      : null;
    return (
      <div className={containerClass}>
        <div className="input-wrapper">
          {label}
          <select
            value={props.input.value || '0'}
            className={`input input-${props.type} ${props.max ? 'input-max' : ''} ${
              props.nomargin ? 'nomargin' : ''
            } ${errorClass(props.input.errors)}`}
            id={props.input.name}
            {...props.input}
            placeholder={props.input.placeholder}
          >
            {options}
          </select>
        </div>
        {props.input.errors &&
          props.input.errors.map((error: any) => (
            <small key={error} className="text-danger">
              {error.messageCompiled}
            </small>
          ))}
      </div>
    );
  } else if (props.type === 'textarea') {
    return (
      <div className={containerClass}>
        <div className="input-wrapper">
          {label}
          <textarea
            className={`input input-${props.type} ${errorClass(props.input.errors)}`}
            id={props.input.name}
            readOnly={props.readonly}
            {...props.input}
            placeholder={props.input.placeholder}
          />
        </div>
        {props.input.errors &&
          props.input.errors.map((error: any) => (
            <small key={error} className="text-danger">
              {error.messageCompiled}
            </small>
          ))}
      </div>
    );
  } else {
    return (
      <div className={containerClass}>
        {label}
        <div className="input-wrapper">
          <input
            className={`input ${props.dark ? 'dark' : ''} input-${props.type} ${errorClass(props.input.errors)}`}
            id={props.input.name}
            readOnly={props.readonly}
            {...props.input}
            placeholder={props.input.placeholder}
            type={props.type}
            min={props.min || 0}
            step={props.step || 1}
          />
        </div>
        {props.input.errors &&
          props.input.errors.map((error: any) => (
            <small key={error} className="text-danger">
              {error.messageCompiled}
            </small>
          ))}
        {props.help && <small className="text-help">{props.help}</small>}
      </div>
    );
  }
};
export default Input;
