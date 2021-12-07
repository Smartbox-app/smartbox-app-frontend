import React from 'react';

import './Discounts.scss';
import {__} from "../../../../../helpers/i18n";

interface Props {
  discounts: string[];
}

const Discounts = ({ discounts }: Props) => {
  let dataToDisplay;
  if (discounts.length === 0) {
    dataToDisplay = <p className="no-discounts">{__('application.noDiscountsToShow')}</p>;
  } else {
    dataToDisplay = discounts.map((name: string, key: number) => (
      <div className="single-discont" key={`discounts-${key}`}>
        {' '}
        {name}
      </div>
    ));
  }
  return <div className="discounts-wrapper">{dataToDisplay}</div>;
};

export default Discounts;
