import React from 'react';

import { InputSizeProps, resolveInputSize } from 'src/components/Common/input-sizes';
import { StyledInputHelp } from 'src/components/Common/input-styled';
import { __ } from 'src/helpers/i18n';

interface Props extends InputSizeProps {
  text: string;
}

const InputHelp = ({ text, size, big, compact }: Props) => {
  if (!text) return null;

  const resolvedSize = resolveInputSize({ size, big, compact });

  return (
    <StyledInputHelp $size={resolvedSize}>
      <span className="fa fa-info-circle" /> {__(text)}
    </StyledInputHelp>
  );
};

export { InputHelp };
