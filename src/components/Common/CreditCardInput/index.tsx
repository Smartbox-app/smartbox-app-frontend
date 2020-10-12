import React, { useEffect } from 'react';
import { addYears } from 'date-fns';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { __ } from '../../../helpers/i18n';

import './CreditCardInput.scss';

interface Props {
  register: any;
  errors: any;
  control: any;
}

const CreditCardInput = ({ register, errors, control }: Props) => {
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
      {console.log('errors', errors)}
      <div className="card-number-wrapper">
        <label htmlFor="card-number">
          <span>{__('application.ccNumber')}:</span>
          <input type="text" placeholder="0000 0000 0000 0000" name="cardNumber" ref={register({ required: true })} />
          {errors.cardNumber && <p className="input-error-wrapper">Pole wymagane</p>}
        </label>
      </div>
      <div className="user-wrapper">
        <label htmlFor="owner">
          <span>{__('application.owner')}:</span>
          <input type="text" placeholder="Jan Kowalski" name="owner" ref={register({ required: true })} />
          {errors.owner && <p className="input-error-wrapper">Pole wymagane</p>}
        </label>
      </div>
      <div className="expiration-date-wrapper">
        <span>{__('application.expiryDate')}:</span>
        <div className="expiration-date">
          <Controller
            name="expirationDateMonth"
            rules={{ required: true }}
            control={control}
            defaultValue={optionsMonth[0]}
            options={optionsMonth}
            as={<Select styles={customStyles} />}
          />

          <Controller
            name="expirationDateYear"
            rules={{ required: true }}
            control={control}
            defaultValue={yearMonth[0]}
            options={yearMonth}
            as={<Select styles={customStyles} />}
          />
        </div>
      </div>
      <div className="cvv-wrapper">
        <label htmlFor="cvv">
          <span>{__('application.ccv')}:</span>
          <input type="text" placeholder="123" name="cvv" ref={register({ required: true })} />
          {errors.owner && <p className="input-error-wrapper">Pole wymagane</p>}
        </label>
      </div>
    </div>
  );
};

export default CreditCardInput;
