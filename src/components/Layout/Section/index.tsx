import React from 'react';
import { Section as UISection } from 'src/components/ui';

interface Props {
  children: React.ReactNode;
  full?: boolean;
  half?: boolean;
  highlight?: boolean;
}

const Section = ({ children }: Props) => (
  <UISection>{children}</UISection>
);

export default Section;
