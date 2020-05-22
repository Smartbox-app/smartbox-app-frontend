import React from 'react';

import './Section.scss';

interface Props {
  children: React.ReactNode;
  full?: boolean;
  half?: boolean;
}

const Section = ({ children, full, half }: Props) => (
  <section className={`section-wrapper ${full && 'section-full-width'} ${half && 'section-half-width'}`}>
    {children}
  </section>
);

export default Section;
