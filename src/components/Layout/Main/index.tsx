import React from 'react';
import { Footer } from '..';

import './Main.scss';

interface Props {
  children: React.ReactNode;
}

const Main = ({ children }: Props) => (
  <main>
    {children}
    <Footer />
  </main>
);

export default Main;
