import React from 'react';

import { InputSizeProps, resolveInputSize } from 'src/components/Common/input-sizes';
import { InputError } from 'src/components/Common/InputError';
import { TranslatableObject } from 'src/utils/errors-trans';

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
