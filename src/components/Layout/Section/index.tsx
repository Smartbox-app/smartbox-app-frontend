import React from 'react';

import './Section.scss';

interface Props {
  children: React.ReactNode;
  full?: boolean;
  half?: boolean;
  highlight?: boolean;
}

const Section = ({ children, full, half, highlight }: Props) => (
  <section
    className={`section-wrapper ${full ? 'section-full-width' : ''} ${half ? 'section-half-width' : ''} ${
      highlight ? 'section-highlight' : ''
    }`}
  >
    {children}
  </section>
);

export default Section;
