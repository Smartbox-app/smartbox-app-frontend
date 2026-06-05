import React from 'react';
import { InputSizeProps, resolveInputSize } from '../input-sizes';
import { StyledInputError } from '../input-styled';

interface Props extends InputSizeProps {
  error: string;
}

const InputError = ({ error, size, big, compact }: Props) => {
  if (!error) return null;

  const resolvedSize = resolveInputSize({ size, big, compact });

  return (
    <StyledInputError $size={resolvedSize}>
      <span className="fa fa-exclamation-circle" /> {error}
    </StyledInputError>
  );
};

export { InputError };
