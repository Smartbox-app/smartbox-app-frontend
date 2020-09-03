import React from 'react';

import './Main.scss';

interface Props {
  children: React.ReactNode;
}

const Main = ({ children }: Props) => <main>{children}</main>;

export default Main;
