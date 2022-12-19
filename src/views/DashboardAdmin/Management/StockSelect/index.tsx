import React from 'react';
import { Input } from '../../../../components/Common';

import './StockSelect.scss';
import { __ } from '../../../../helpers/i18n';

const StockSelect = () => {
  return (
    <div className="stock-select-wrapper">
      <Input
        className="form-field field-type-staticSelect"
        type="select"
        input={{
          label: __('application.stockSelect'),
          name: 'stockId',
          id: 'stockId',
          placeholder: __('application.stockSelect'),
          onChange: (e: any) => e.target.value,
        }}
        options={[
          {
            value: 'Ostrów Wielkopolski',
            name: 'Ostrów Wielkopolski',
          },
        ]}
      />
    </div>
  );
};

export default StockSelect;
