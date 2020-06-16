import React from 'react';

import './CustomArrow.scss';

interface Props {
  className?: string;
  left?: boolean;
  right?: boolean;
  onClick?: () => void;
}

const CustomArrow = ({ className, onClick, left, right }: Props) => (
  <div
    role="button"
    tabIndex={0}
    className={`custom-arrow ${left ? 'prev' : ''}  ${right ? 'next' : ''}`}
    onClick={onClick}
  >
    {right ? <span className="fa fa-arrow-right" /> : ''}
    {left ? <span className="fa fa-arrow-left" /> : ''}
  </div>
);

export default CustomArrow;
