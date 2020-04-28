import React from 'react';

import './Section.scss';

interface Props {
  children: React.ReactNode;
}

const Section = (props: Props) => {
  const { children } = props;
  return <section>{children}</section>;
};

export default Section;
