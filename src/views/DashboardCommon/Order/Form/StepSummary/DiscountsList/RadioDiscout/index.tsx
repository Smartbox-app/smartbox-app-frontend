import React from 'react';

import './RadioDiscout.scss';

interface Props {
  text: string;
  value: number;
  register?: any;
}

const RadioDiscout = ({ value, text, register }: Props) => (
  <div className="radio-discount-wrapper">
    <input name="discount" type="radio" value={value} id={text} />
    <label htmlFor={text} className="discount-option">
      {text}
    </label>
  </div>
);

export default RadioDiscout;
