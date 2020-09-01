import React from 'react';
import { __ } from '../../../../../../../helpers/i18n';

import './BlikInput.scss';

interface Props {
  register?: any;
}

const BlikInput = ({ register }: Props) => {
  return (
    <div className="blik-input-wrapper">
      <label htmlFor="blik-input" className="blik-input-label">
        {__('application.code')}
      </label>
      <input id="blik-input" name="blikInput" type="number" className="blik-input" ref={register({ required: true })} />
    </div>
  );
};

export default BlikInput;
