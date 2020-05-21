import React from 'react';

import './Section.scss';

interface Props {
  children: React.ReactNode;
  full?: boolean;
  half?: boolean;
}

const Section = (props: Props) => {
  const { children, full, half } = props;
  return (
    <section className={`section-wrapper ${full && 'section-full-width'} ${half && 'section-half-width'}`}>
      {children}
    </section>
  );
};

export default Section;
