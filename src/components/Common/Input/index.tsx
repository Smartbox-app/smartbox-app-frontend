import * as React from 'react';
import { __ } from '../../../helpers/i18n';
import { InputHelp } from '../InputHelp';
import { InputErrors } from '../InputErrors';
import styled, { css } from 'styled-components';
import { getColorForBackground } from '../../../utils/color';
import { InputLabel } from 'src/components/ui/InputLabel';
import { FieldAndEventFunction } from 'itf_formbuilder_react';
import { TranslatableObject } from '../../../utils/errors-trans';

export type FormFieldInput = {
  label?: string;
  name: string;
  id?: string;
  placeholder?: string;
  errors?: TranslatableObject[];
  value?: unknown;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onFocus?: FieldAndEventFunction;
  onBlur?: FieldAndEventFunction;
};
import { InputSizeProps, resolveInputSize } from '../input-sizes';
import {
  StyledFieldContainer,
  StyledFieldWrapper,
  StyledNativeSelect,
  StyledTextarea,
  StyledTextInput,
} from '../input-styled';

interface Props extends InputSizeProps {
  type: string;
  input: FormFieldInput;
  error?: string;
  meta?: { touched?: boolean; error?: string | null };
  touched?: boolean;
  min?: number;
  max?: boolean;
  step?: number;
  options?: {
    name?: string;
    label?: string;
    value: string | number;
    disabled?: boolean;
  }[];
  readonly?: boolean;
  required?: boolean;
  nomargin?: boolean;
  help?: string;
  dark?: boolean;
  className?: string;
}

const StyledRadioOptionContainer = styled.div`
  display: flex;
  position: relative;
  cursor: pointer;
  margin-bottom: 4px;

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
      background-color: ${props.theme.colors.primary};
      color: ${getColorForBackground(props.theme.colors.primary)};
    `}
`;

const hasErrors = (errors: TranslatableObject[] | undefined) =>
  !!(errors && errors.length);

const Input = (props: Props) => {
  const resolvedSize = resolveInputSize(props);
  const invalid = hasErrors(props.input.errors);

  if (props.type === 'hidden') {
    return <input type="hidden" {...(props.input as React.InputHTMLAttributes<HTMLInputElement>)} />;
  }

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
      <StyledFieldContainer
        className={props.className}
        $noMargin={props.nomargin}
      >
        <InputLabel labelFor={props.input.name} required={props.required}>
          {__(props.input.label ?? '')}
        </InputLabel>
        <StyledFieldWrapper>
          <StyledNativeSelect
            $size={resolvedSize}
            $error={invalid}
            value={
              typeof props.input.value === 'string' ||
              typeof props.input.value === 'number'
                ? props.input.value
                : '0'
            }
            id={props.input.name}
            {...(props.input as unknown as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {options}
          </StyledNativeSelect>
        </StyledFieldWrapper>
        {props.input.errors && (
          <InputErrors size={resolvedSize} errors={props.input.errors} />
        )}
      </StyledFieldContainer>
    );
  }

  if (props.type === 'textarea') {
    return (
      <StyledFieldContainer
        className={props.className}
        $noMargin={props.nomargin}
      >
        <InputLabel labelFor={props.input.name}>
          {__(props.input.label ?? '')}
        </InputLabel>
        <StyledFieldWrapper>
          <StyledTextarea
            $size={resolvedSize}
            $error={invalid}
            id={props.input.name}
            readOnly={props.readonly}
            {...(props.input as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            placeholder={props.input.placeholder}
          />
        </StyledFieldWrapper>
        {props.input.errors && (
          <InputErrors size={resolvedSize} errors={props.input.errors} />
        )}
        {props.help && <InputHelp size={resolvedSize} text={props.help} />}
      </StyledFieldContainer>
    );
  }

  if (props.type === 'radio') {
    return (
      <StyledFieldContainer
        className={props.className}
        $noMargin={props.nomargin}
      >
        <InputLabel labelFor={props.input.name}>
          {__(props.input.label ?? '')}
        </InputLabel>
        {props.options?.map((option) => (
          <StyledRadioOptionContainer key={option.value}>
            <label htmlFor={`${props.input.name}-${option.value}`}>
              <input
                name={props.input.name}
                id={`${props.input.name}-${option.value}`}
                onChange={props.input.onChange}
                type="radio"
                value={option.value}
                checked={props.input.value === option.value}
              />
              <p>{__(option.label ?? '')}</p>
              <StyledRadioCheck checked={props.input.value === option.value} />
            </label>
          </StyledRadioOptionContainer>
        ))}
        {props.help && <InputHelp size={resolvedSize} text={props.help} />}
      </StyledFieldContainer>
    );
  }

  return (
    <StyledFieldContainer
      className={props.className}
      $noMargin={props.nomargin}
    >
      <InputLabel labelFor={props.input.name}>
        {__(props.input.label ?? '')}
      </InputLabel>
      <StyledFieldWrapper>
        <StyledTextInput
          $size={resolvedSize}
          $error={invalid}
          $colorInput={props.type === 'color'}
          id={props.input.name}
          readOnly={props.readonly}
          {...(props.input as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
          placeholder={props.input.placeholder}
          type={props.type}
          min={props.min || 0}
          step={props.step || 1}
        />
      </StyledFieldWrapper>
      {props.input.errors && (
        <InputErrors size={resolvedSize} errors={props.input.errors} />
      )}
      {props.help && <InputHelp size={resolvedSize} text={props.help} />}
    </StyledFieldContainer>
  );
};

export default Input;
