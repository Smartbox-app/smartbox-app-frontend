import React from 'react';
import PhoneInput from 'react-phone-number-input';
import { InputErrors } from '../InputErrors';
import { TranslatableObject } from '../../../utils/errors-trans';
import { InputLabel } from 'src/components/ui/InputLabel';
import { __ } from 'src/helpers/i18n';
import { InputSizeProps, resolveInputSize } from '../input-sizes';
import { StyledPhoneFieldContainer } from '../input-styled';

interface Props extends InputSizeProps {
  value?: string;
  label: string;
  name: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
  errors?: TranslatableObject[];
}

const InputPhone = ({
  value,
  label,
  name,
  onChange,
  disabled,
  errors,
  size,
  big,
  compact,
}: Props) => {
  const resolvedSize = resolveInputSize({ size, big, compact });
  const invalid = !!(errors && errors.length);

  return (
    <StyledPhoneFieldContainer
      $size={resolvedSize}
      $error={invalid}
      $noMargin={false}
    >
      <InputLabel labelFor={name}>{__(label)}</InputLabel>
      <PhoneInput
        withCountryCallingCode
        country="PL"
        defaultCountry="PL"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {errors && <InputErrors size={resolvedSize} errors={errors} />}
    </StyledPhoneFieldContainer>
  );
};

export { InputPhone };
