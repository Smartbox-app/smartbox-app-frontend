import React from 'react';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import RadioDiscout from './RadioDiscout';

import './DiscountsList.scss';

interface Props {
  register: any;
}

const DiscountsList = ({ register }: Props) => {
  const discoutsList = [
    { text: 'Jednorazowy rabat 5%', value: 5 },
    { text: 'Jednorazowy rabat 10%', value: 10 },
    { text: 'Kod rabatowy', value: 0 },
  ];

  const dataToDisplay = discoutsList.map((data: any) => (
    <RadioDiscout text={data.text} value={data.value} register={register} />
  ));

  return (
    <div>
      <FormHeader title="Stałe rabaty:" />
      <div className="discounts-list-wrapper">{dataToDisplay}</div>
    </div>
  );
};

export default DiscountsList;
