import React from 'react';

import './Section.scss';

interface Props {
  children: React.ReactNode;
}

const Section = (props: Props) => {
  const { children } = props;
  return <section className="section-wrapper">{children}</section>;
};

export default Section;
