import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Main = (props: Props) => {
  const { children } = props;
  return <main> {children} </main>;
};

export default Main;
