import React from 'react';
import { __ } from '../../../../../helpers/i18n';

interface Props {
  children: React.ReactNode;
  text: string;
  icon: string;
}

const DescriptionRow = ({ children, text, icon }: Props) => {
  return (
    <p className="single">
      <span className={`fa ${icon}`} />
      <div>
        <span>{__(text)}: </span>
        <strong>{children}</strong>
      </div>
    </p>
  );
};

export default DescriptionRow;
