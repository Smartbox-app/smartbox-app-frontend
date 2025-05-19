import * as React from 'react';
import { __ } from '../../../helpers/i18n';
import { InputHelp } from '../InputHelp';
import { InputErrors } from '../InputErrors';
import './Input.scss';
import styled, { css } from 'styled-components';
import { getColorForBackground } from '../../../utils/color';
import { InputLabel } from 'src/components/ui/InputLabel';

interface Props {
  type: string;
  input: any;
  error?: any;
  meta?: any;
  touched?: any;
  min?: number;
  max?: boolean;
  step?: number;
  options?: any[];
  readonly?: boolean;
  required?: boolean;
  nomargin?: boolean;
  help?: string;
  dark?: boolean;
  className?: string;
  big?: boolean;
}

const errorClass = (errors: any[] | undefined) =>
  errors && errors.length ? 'is-invalid' : '';

const StyledContainer = styled.div`
  &.big {
    .input {
      border: 2px solid ${(props) => props.theme.colors.primary};
    }
  }
  &.compact {
    .input {
      border-bottom: 2px solid ${(props) => props.theme.colors.primary};
    }
  }
`;

const StyledRadioOptionContainer = styled.div`
  display: flex;
  position: relative;
  cursor: pointer;
  margin-bottom: 10px;

  label {
    cursor: pointer;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  p {
    margin-left: 30px;
    margin-top: 0;
  }
`;

const StyledRadioCheck = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 1px solid ${(props) => props.theme.colors.primary};

  ${(props) =>
    props.checked &&
    css`
      background-color: ${(props) => props.theme.colors.primary};
      color: ${(props) => getColorForBackground(props.theme.colors.primary)};
    `}
`;

const Input = (props: Props) => {
  const containerClass = `input-container ${props.big ? 'big' : 'compact'} ${props.className || ''} ${props.max ? 'input-max' : ''} ${
    props.nomargin ? 'nomargin' : ''
  } ${props.type === 'hidden' ? 'hidden' : ''}`;

  if (props.type === 'select') {
    const options = props.options
      ? props.options.map((option) => (
          <option
            disabled={option.disabled}
            key={option.value}
            value={option.value}
          >
            {option.name}
          </option>
        ))
      : null;
    return (
      <StyledContainer className={containerClass}>
        <div className="input-wrapper">
          <InputLabel labelFor={props.input.name}>
            {__(props.input.label)}
          </InputLabel>
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
        {props.input.errors && (
          <InputErrors big={props.big} errors={props.input.errors} />
        )}
      </StyledContainer>
    );
  } else if (props.type === 'textarea') {
    return (
      <StyledContainer className={containerClass}>
        <div className="input-wrapper">
          <InputLabel labelFor={props.input.name}>
            {__(props.input.label)}
          </InputLabel>
          <textarea
            className={`input input-${props.type} ${errorClass(props.input.errors)}`}
            id={props.input.name}
            readOnly={props.readonly}
            {...props.input}
            placeholder={props.input.placeholder}
          />
        </div>
        {props.input.errors && (
          <InputErrors big={props.big} errors={props.input.errors} />
        )}
      </StyledContainer>
    );
  } else if (props.type === 'radio') {
    return (
      <StyledContainer className={containerClass}>
        <InputLabel labelFor={props.input.name}>
          {__(props.input.label)}
        </InputLabel>
        {props.options?.map((option) => (
          <StyledRadioOptionContainer key={option.value}>
            <label htmlFor={option.value}>
              <input
                name={props.input.name}
                id={option.value.toString()}
                onChange={props.input.onChange}
                type="radio"
                value={option.value}
                checked={props.input.value === option.value}
              />
              <p>{__(option.label)}</p>
              <StyledRadioCheck checked={props.input.value === option.value} />
            </label>
          </StyledRadioOptionContainer>
        ))}
      </StyledContainer>
    );
  } else {
    return (
      <StyledContainer className={containerClass}>
        <InputLabel labelFor={props.input.name}>
          {__(props.input.label)}
        </InputLabel>
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
        {props.input.errors && (
          <InputErrors big={props.big} errors={props.input.errors} />
        )}
        {props.help && <InputHelp text={props.help} />}
      </StyledContainer>
    );
  }
};
export default Input;
