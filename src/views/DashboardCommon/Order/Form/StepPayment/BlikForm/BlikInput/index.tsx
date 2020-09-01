import React from 'react';

import './BlikInput.scss';

interface Props {
  register?: any;
}

const BlikInput = ({ register }: Props) => {
  return (
    <div className="blik-input-wrapper">
      <label htmlFor="blik-input" className="blik-input-label">
        Kod:
      </label>
      <input
        id="blik-input"
        name="blikInput"
        type="number"
        className="blik-input"
        ref={register({ required: true })}
      />
    </div>
  );
};

export default BlikInput;
