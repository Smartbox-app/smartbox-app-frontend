import React from 'react';
import { TranslatableObject } from '../../../utils/errors-trans';
import { InputError } from '../InputError';
import { InputSizeProps, resolveInputSize } from '../input-sizes';

interface Props extends InputSizeProps {
  errors: TranslatableObject[];
}

const InputErrors = ({ errors, size, big, compact }: Props) => {
  const resolvedSize = resolveInputSize({ size, big, compact });

  return (
    <>
      {errors.map((error, index) => (
        <InputError
          key={index}
          size={resolvedSize}
          error={error.messageCompiled}
        />
      ))}
    </>
  );
};

export { InputErrors };
