import React from 'react';

interface Props {
  children: React.ReactNode;
  text: string;
  icon: string;
}

const DescriptionRow = ({ children, text, icon }: Props) => {
  return (
    <p className="single">
      <span className={`fa ${icon}`} />
      <span>{text}: </span>
      <strong>{children}</strong>
    </p>
  );
};

export default DescriptionRow;
