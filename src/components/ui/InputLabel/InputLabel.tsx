import { ReactNode } from 'react';
import styled from 'styled-components';

import { AsterixRequired } from 'src/components/Common';

export type InputLabelProps = {
  labelFor?: string;
  required?: boolean;
  children: ReactNode;
};

const StyledLabel = styled('label')(({ theme }) => ({
  color: theme.colors.text.secondary,
  fontWeight: 500,
  fontSize: 13,
  lineHeight: 1.3,
  // marginBottom: 10,
  display: 'flex',
  gap: theme.spacing
}));

export const InputLabel = ({
  children,
  labelFor,
  required,
}: InputLabelProps) => {
  return (
    <StyledLabel htmlFor={labelFor}>
      {children}
      {required ? <AsterixRequired /> : null}
    </StyledLabel>
  );
};
