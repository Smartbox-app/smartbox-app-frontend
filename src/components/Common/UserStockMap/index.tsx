import React from 'react';

import { Spinner } from 'src/components/Branded';
import { __ } from 'src/helpers/i18n';
import { useGetStockBoxesQuery, useGetStockQuery } from 'src/queries';

import { MapView } from '../../../views/DashboardCommon/MapView';

interface Props {
  boxId: string;
  boxNumber: string;
  boxAdditionalInfo: string;
  stockId: string;
}

const UserStockMap = ({
  boxId,
  stockId,
  boxNumber,
  boxAdditionalInfo,
}: Props) => {
  const { data: stock, isPending: stockLoading } = useGetStockQuery(stockId);
  const { data: boxes = [], isPending: boxesLoading } =
    useGetStockBoxesQuery(stockId);

  if (stockLoading || boxesLoading || !stock) return <Spinner />;

  return (
    <>
      <p className="user-box">
        {__('application.yourStoreNumber')} <strong>{boxNumber}</strong>
      </p>
      {!!boxAdditionalInfo && (
        <p className="user-box">
          {__('application.yourBoxAdditional')}{' '}
          <strong>{boxAdditionalInfo}</strong>
        </p>
      )}

      <MapView stock={stock} boxes={boxes} user highlightId={boxId} />
    </>
  );
};

export { UserStockMap };
