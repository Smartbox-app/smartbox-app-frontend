import React from 'react';
import { __ } from '../../../helpers/i18n';
import { InputSizeProps, resolveInputSize } from '../input-sizes';
import { StyledInputHelp } from '../input-styled';

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
