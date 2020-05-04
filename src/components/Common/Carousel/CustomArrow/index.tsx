import React from 'react';

import './CustomArrow.scss';

interface Props {
  className?: string;
  onClick?: () => void;
  left?: boolean;
  right?: boolean;
}

const CustomArrow = ({ className, onClick, left, right }: Props) => (
  <div
    role="button"
    tabIndex={0}
    className={`${1} custom-arrow ${left ? 'prev' : ''}  ${right ? 'next' : ''}`}
    onClick={onClick}
  >
    {right ? <span className="fa fa-arrow-right" /> : ''}
    {left ? <span className="fa fa-arrow-left" /> : ''}
  </div>
);

export default CustomArrow;
