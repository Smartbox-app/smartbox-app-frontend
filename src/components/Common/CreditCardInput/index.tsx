import React from 'react';
import { addYears } from 'date-fns';
import Select from 'react-select';
import { __ } from '../../../helpers/i18n';

import './CreditCardInput.scss';

interface Props {
  register: any;
  errors: any;
}

const CreditCardInput = ({ register, errors }: Props) => {
  const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  const optionsMonth = month.map((data: string) => ({
    value: data,
    label: data,
  }));

  const year = [
    `${new Date().getFullYear()}`,
    `${addYears(new Date(), 1).getFullYear()}`,
    `${addYears(new Date(), 2).getFullYear()}`,
    `${addYears(new Date(), 3).getFullYear()}`,
    `${addYears(new Date(), 4).getFullYear()}`,
    `${addYears(new Date(), 5).getFullYear()}`,
    `${addYears(new Date(), 6).getFullYear()}`,
    `${addYears(new Date(), 7).getFullYear()}`,
    `${addYears(new Date(), 8).getFullYear()}`,
  ];

  const yearMonth = year.map((data: string) => ({
    value: data,
    label: data,
  }));

  const customStyles = {
    container: (provided: any, state: any) => ({
      ...provided,
      width: '100%',
      paddingRight: 3,
    }),
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: 0,
      marginTop: 2,
      height: 40,
      border: '1px solid #aaa',
      borderBottomWidth: 2,
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
        borderBottom: '2px solid #0674bd',
      },
      '&:focus': {
        boxShadow: 'none',
        borderBottom: '2px solid #0674bd',
      },
    }),
    menuList: (provided: any) => ({
      ...provided,
      height: '150px',
      borderRadius: 0,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      padding: 2,
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: 0,
      width: 20,
    }),
  };

  return (
    <div className="credit-card-input-wrapper">
      <div className="card-number-wrapper">
        <label htmlFor="card-number">
          <span>{__('application.ccNumber')}:</span>
          <input type="text" placeholder="0000 0000 0000 0000" name="cardNumber" ref={register({ required: true })} />
        </label>
      </div>
      <div className="user-wrapper">
        <label htmlFor="owner">
          <span>{__('application.owner')}:</span>
          <input type="text" placeholder="Jan Kowalski" name="owner" ref={register({ required: true })} />
        </label>
      </div>
      <div className="expiration-date-wrapper">
        <span>{__('application.expiryDate')}:</span>
        <div className="expiration-date">
          <Select defaultValue={optionsMonth[0]} styles={customStyles} options={optionsMonth} />
          <Select defaultValue={yearMonth[0]} styles={customStyles} options={yearMonth} />
        </div>
      </div>
      <div className="cvv-wrapper">
        <label htmlFor="cvv">
          <span>{__('application.ccv')}:</span>
          <input type="text" placeholder="123" name="cvv" ref={register({ required: true })} />
        </label>
      </div>
    </div>
  );
};

export default CreditCardInput;
