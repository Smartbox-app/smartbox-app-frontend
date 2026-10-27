import React from 'react';
import { useParams } from 'react-router';

import { StockBasicReq } from 'smartbox-types';
import { StockSectionForm } from '../StockSectionForm';

const BasicData = () => {
  const { stockId } = useParams<{ stockId: string }>();

  return (
    <StockSectionForm<StockBasicReq>
      formId="manageStockBasic"
      fetchPath={`stock/form/basic/${stockId}`}
      sendPath={`stock/${stockId}/basic`}
    />
  );
};

export { BasicData };
