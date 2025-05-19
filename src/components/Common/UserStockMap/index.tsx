import React, { useEffect, useState } from 'react';
import ApiService from '../../../services/api-service';
import { BoxMapRes, BoxMapUserRes, IStock } from 'smartbox-types';
import { Spinner } from '../../../components/Branded';
import { MapView } from '../../../views/DashboardCommon/MapView';
import { __ } from '../../../helpers/i18n';

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
  const [stock, setStock] = useState<IStock>();
  const [boxes, setBoxes] = useState<BoxMapUserRes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getBoxes = async () => {
    await ApiService.callFetch(
      'GET',
      `box/all/${stockId}`,
      (data: BoxMapRes[]) => {
        setBoxes(data);
      },
    );
    setLoading(false);
  };

  const getStock = async () => {
    await ApiService.callFetch('GET', `stock/${stockId}`, (res: IStock) => {
      setStock(res);
    });
  };

  useEffect(() => {
    getStock();
    getBoxes();
  }, []);

  if (loading || !stock) return <Spinner />;

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
