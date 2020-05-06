import React from 'react';

import './Main.scss';

interface Props {
  children: React.ReactNode;
}

const Main = (props: Props) => {
  const { children } = props;
  return <main>{children}</main>;
};

export default Main;
