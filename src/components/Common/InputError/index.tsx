import React from 'react';

import { InputSizeProps, resolveInputSize } from 'src/components/Common/input-sizes';
import { StyledInputError } from 'src/components/Common/input-styled';
import { translateUiError } from 'src/utils/translate-ui-error';

interface Props extends InputSizeProps {
  error: string;
}

const InputError = ({ error, size, big, compact }: Props) => {
  if (!error) return null;

  const resolvedSize = resolveInputSize({ size, big, compact });

  return (
    <StyledInputError $size={resolvedSize}>
      <span className="fa fa-exclamation-circle" /> {translateUiError(error)}
    </StyledInputError>
  );
};

export { InputError };
