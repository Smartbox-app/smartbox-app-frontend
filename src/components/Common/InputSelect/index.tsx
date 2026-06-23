import React, { useMemo } from 'react';
import ReactSelect from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { __ } from '../../../helpers/i18n';
import { TranslatableObject } from '../../../utils/errors-trans';
import { InputErrors } from '../InputErrors';
import { InputHelp } from '../InputHelp';
import { InputLabel } from 'src/components/ui/InputLabel';
import { ErrorText } from 'src/components/ui/ErrorText';
import {
  getReactSelectStyles,
  InputSizeProps,
  resolveInputSize,
} from '../input-sizes';
import { StyledFieldContainer, StyledFieldWrapper } from '../input-styled';
import { useTheme } from 'styled-components';

export type InputSelectOption = {
  label: string;
  value: string | number;
};

export type InputSelectProps = InputSizeProps & {
  options: InputSelectOption[];
  onChange: (value: string | number | null | (string | number)[]) => void;
  value?: string | number | null | (string | number)[];
  help?: string;
  placeholder?: string;
  name: string;
  label?: string;
  multiple?: boolean;
  noMargin?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  allowCustomValue?: boolean;
  creatable?: boolean;
  isClearable?: boolean;
  required?: boolean;
  error?: string;
  errors?: TranslatableObject[];
  className?: string;
  onBlur?: () => void;
  formatCreateLabel?: (inputValue: string) => string;
  onCreateOption?: (inputValue: string) => void;
  isValidNewOption?: (inputValue: string) => boolean;
};

const InputSelect = ({
  options,
  value,
  onChange,
  placeholder,
  multiple,
  errors,
  error,
  help,
  noMargin,
  readonly,
  disabled,
  label,
  name,
  allowCustomValue,
  creatable = false,
  isClearable = true,
  required,
  size,
  big,
  compact,
  className,
  onBlur,
  formatCreateLabel,
  onCreateOption,
  isValidNewOption,
}: InputSelectProps) => {
  const theme = useTheme();
  const resolvedSize = resolveInputSize({ size, big, compact });
  const isDisabled = !!(readonly || disabled);
  const invalid = !!(error || (errors && errors.length));
  const selectStyles = useMemo(
    () =>
      getReactSelectStyles(theme, resolvedSize, {
        error: invalid,
        disabled: isDisabled,
      }),
    [theme, resolvedSize, invalid, isDisabled],
  );

  const getSelectedValue = () => {
    if (multiple) {
      const values = Array.isArray(value) ? value : [];
      return values.map((val) => {
        const found = options.find((opt) => opt.value === (val as unknown as InputSelectOption).value || opt.value === val);

        if (found) return found;
        return { label: String(val), value: val };
      });
    }

    if (value === null || value === undefined || value === '') {
      return null;
    }

    const found = options.find((opt) => opt.value === value);
    if (found) return found;

    if (allowCustomValue) {
      return { label: String(value), value };
    }

    return null;
  };

  const handleChange = (val: null | InputSelectOption | InputSelectOption[]) => {
    if (multiple) {
      const selected = (val as InputSelectOption[]) || [];
      onChange(selected.map((item) => item.value));
      return;
    }

    if (val && typeof val === 'object' && 'value' in val) {
      onChange(val.value);
      return;
    }

    onChange(null);
  };

  const selectProps = {
    menuPortalTarget: document.body,
    menuPlacement: 'auto' as const,
    styles: selectStyles,
    isDisabled: isDisabled,
    value: getSelectedValue(),
    classNamePrefix: 'input-select',
    inputId: name,
    onChange: handleChange,
    onBlur,
    options,
    isClearable,
    isMulti: multiple,
    placeholder: placeholder ? __(placeholder) : __('application.select'),
    noOptionsMessage: () => __('application.selectNoOptions'),
    formatCreateLabel: creatable
      ? formatCreateLabel ??
        ((input: string) =>
          `${__('application.inviteUsersAddEmail')}: ${input}`)
      : undefined,
    isValidNewOption: creatable ? isValidNewOption ?? (() => true) : undefined,
    onCreateOption: creatable
      ? (input: string) => {
          if (onCreateOption) {
            onCreateOption(input);
            return;
          }
          if (multiple) {
            const current = Array.isArray(value) ? value : [];
            onChange([...current, input]);
            return;
          }
          handleChange({
            label: input,
            value: input,
          } as InputSelectOption);
        }
      : undefined,
  };

  return (
    <StyledFieldContainer className={className} $noMargin={noMargin}>
      {label ? (
        <InputLabel labelFor={name} required={required}>
          {__(label)}
        </InputLabel>
      ) : null}
      <StyledFieldWrapper>
        {creatable ? (
          <CreatableSelect {...selectProps} />
        ) : (
          <ReactSelect {...selectProps} />
        )}
      </StyledFieldWrapper>
      {error ? <ErrorText error={error} /> : null}
      {errors && errors.length > 0 ? (
        <InputErrors size={resolvedSize} errors={errors} />
      ) : null}
      {help ? <InputHelp size={resolvedSize} text={help} /> : null}
    </StyledFieldContainer>
  );
};

export { InputSelect };
