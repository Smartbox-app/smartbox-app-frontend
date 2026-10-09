import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { order } from '../../../../../../actions';
import { Section as InsideSection } from '../../../../../../components/Layout';
import { SingleOption } from './SingleOption';

import '../StepStock.scss';
import { useGetMyDetailsQuery } from 'src/queries';
import { Header, Skeleton } from '../../../../../../components/ui';
import { __ } from '../../../../../../helpers/i18n';
import { StockGroupWithStocks, StockList } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const Tiles = () => {
  const dispatch = useDispatch();

  const [stocksLoading, setStocksLoading] = useState<boolean>(true);
  const [groupsLoading, setGroupsLoading] = useState<boolean>(true);
  const [stocks, setStocks] = useState<StockList[] | null>(null);
  const [groups, setGroups] = useState<StockGroupWithStocks[] | null>(null);

  const getStocks = async () => {
    await ApiService.callFetch('GET', `stock/list`, (data: StockList[]) => {
      setStocks(data);
    });
    setStocksLoading(false);
  };

  const getGroups = async () => {
    await ApiService.callFetch(
      'GET',
      `stock-group/list`,
      (data: StockGroupWithStocks[]) => {
        setGroups(data);
      },
    );
    setGroupsLoading(false);
  };

  const { data: user } = useGetMyDetailsQuery();

  useEffect(() => {
    if (!user) return;

    getStocks();
    getGroups();
    dispatch(order.clearOrder());
  }, [user]);

  if (!user || groupsLoading || stocksLoading || !groups || !stocks)
    return (
      <div className="stocks-skeleton-wrapper">
        <Skeleton height={150} radius={16} />
        <Skeleton height={150} radius={16} />
        <Skeleton height={150} radius={16} />
      </div>
    );
  return (
    <>
      {groups.map((group) => (
        <InsideSection key={group.id} highlight>
          <Header variant="h3">{group.name}</Header>
          <div className="group-stocks-wrapper">
            {group.stocks.map((el) => (
              <SingleOption
                key={el.id}
                value={el.id}
                name={el.name}
                address={el.address}
              />
            ))}
          </div>
        </InsideSection>
      ))}
      <div className="stocks-wrapper">
        {stocks.map((el) => (
          <SingleOption
            key={el.id}
            value={el.id}
            name={el.name}
            address={el.address}
          />
        ))}
      </div>
    </>
  );
};
