import React from 'react';

import './Discounts.scss';

interface Props {
  discounts: string[];
}

const Discounts = ({ discounts }: Props) => {
  let dataToDisplay;
  if (discounts.length === 0) {
    dataToDisplay = <p className="no-discounts">Brak promocji do wyświetlenia</p>;
  } else {
    dataToDisplay = discounts.map((name: string) => <div className="single-discont"> {name}</div>);
  }
  return <div className="discounts-wrapper">{dataToDisplay}</div>;
};

export default Discounts;
