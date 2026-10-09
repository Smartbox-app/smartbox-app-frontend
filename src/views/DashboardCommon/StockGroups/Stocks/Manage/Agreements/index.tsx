import React from 'react';
import { useParams } from 'react-router';
import { StockAgreementsReq } from 'smartbox-types';
import { StockSectionForm } from '../StockSectionForm';

const StockAgreements = () => {
  const { stockId } = useParams<{ stockId: string }>();

  return (
    <StockSectionForm<StockAgreementsReq>
      formId="manageStockAgreements"
      fetchPath={`stock/form/agreements/${stockId}`}
      sendPath={`stock/${stockId}/agreements`}
    />
  );
};

export { StockAgreements };
