import React from 'react';
import { Footer } from '..';

interface Props {
  children: React.ReactNode;
}

const Main = (props: Props) => {
  const { children } = props;
  return (
    <main>
      {' '}
      {children}
      <Footer />
    </main>
  );
};

export default Main;
