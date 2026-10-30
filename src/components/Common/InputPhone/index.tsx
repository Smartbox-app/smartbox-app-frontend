import React from 'react';
import PhoneInput from 'react-phone-number-input';

import { InputSizeProps, resolveInputSize } from 'src/components/Common/input-sizes';
import { StyledPhoneFieldContainer } from 'src/components/Common/input-styled';
import { InputErrors } from 'src/components/Common/InputErrors';
import { InputLabel } from 'src/components/ui/InputLabel';
import { __ } from 'src/helpers/i18n';
import { TranslatableObject } from 'src/utils/errors-trans';

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
