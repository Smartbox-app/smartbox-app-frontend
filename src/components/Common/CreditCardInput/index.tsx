import React from 'react';
import { addYears } from 'date-fns';

import './CreditCardInput.scss';

interface Props {
  register: any;
  errors: any;
}

const CreditCardInput = ({ register, errors }: Props) => {
  const monthOption = ['--', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const yearOption = [
    '----',
    new Date().getFullYear(),
    addYears(new Date(), 1).getFullYear(),
    addYears(new Date(), 2).getFullYear(),
    addYears(new Date(), 3).getFullYear(),
    addYears(new Date(), 4).getFullYear(),
    addYears(new Date(), 5).getFullYear(),
    addYears(new Date(), 6).getFullYear(),
    addYears(new Date(), 7).getFullYear(),
    addYears(new Date(), 8).getFullYear(),
    addYears(new Date(), 9).getFullYear(),
  ];
  console.log('errors', errors);

  return (
    <div className="credit-card-input-wrapper">
      <div className="row card-number-wrapper">
        <label htmlFor="card-number">
          <span>Numer karty:</span>
          <input type="text" placeholder="0000 0000 0000 0000" name="cardNumber" ref={register({ required: true })} />
        </label>
      </div>
      <div className="row user-wrapper">
        <label htmlFor="first-name">
          <span>Imię:</span>
          <input type="text" placeholder="First name" name="firstName" ref={register({ required: true })} />
        </label>
        <label htmlFor="last-name">
          <span>Nazwisko:</span>
          <input type="text" placeholder="Last name" name="lastName" ref={register({ required: true })} />
        </label>
      </div>
      <div className="row expiration-date-wrapper">
        <label htmlFor="month">
          <span>Ważność karty:</span>
          <select name="month" ref={register({ required: true })}>
            {monthOption.map((singleMonth: string) => (
              <option value={singleMonth}>{singleMonth}</option>
            ))}
          </select>
        </label>
        <label htmlFor="year">
          <span />
          <select name="year" ref={register({ required: true })}>
            {yearOption.map((singleYear: any) => (
              <option value={singleYear}>{singleYear}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="row cvv-wrapper">
        <label htmlFor="cvv">
          <span>Numer CVV</span>
          <input type="text" placeholder="CVV" name="cvv" ref={register({ required: true })} />
        </label>
      </div>
    </div>
  );
};

export default CreditCardInput;
