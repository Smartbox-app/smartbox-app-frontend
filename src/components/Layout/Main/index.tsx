import React from 'react';
import { Footer } from '..';

import './Main.scss';

interface Props {
  children: React.ReactNode;
}

const Main = (props: Props) => {
  const { children } = props;
  return (
    <main>
      {children}
      <Footer />
    </main>
  );
};

export default Main;
