import React from 'react';
import { Input } from '../../../../components/Common';

import './StockSelect.scss';

const StockSelect = () => {
  console.log('StockSelect');
  return (
    <div className="stock-select-wrapper">
      <Input
        className="form-field field-type-staticSelect"
        type="select"
        input={{
          label: 'Wybór placu:',
          name: 'stockId',
          id: 'stockId',
          placeholder: 'Wybór placu:',
          // onChange: (e: any) => onChange(e.target.value),
        }}
        options={[
          {
            value: 'Warszawa-Łomianki',
            name: 'Warszawa-Łomianki',
          },
          {
            value: 'Nowy plac',
            name: 'Nowy plac',
          },
        ]}
      />
    </div>
  );
};

export default StockSelect;
