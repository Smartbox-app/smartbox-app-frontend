import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { order } from 'src/actions';
import { Section as InsideSection } from 'src/components/Layout';
import { Header, Skeleton } from 'src/components/ui';
import {
  useGetMyDetailsQuery,
  useGetStockGroupsListQuery,
  useGetStockListQuery,
} from 'src/queries';
import { SingleOption } from './SingleOption';

import '../StepStock.scss';

export const Tiles = () => {
  const dispatch = useDispatch();

  const { data: user } = useGetMyDetailsQuery();
  const { data: stocks, isPending: stocksLoading } = useGetStockListQuery(
    !!user,
  );
  const { data: groups, isPending: groupsLoading } =
    useGetStockGroupsListQuery(!!user);

  useEffect(() => {
    if (!user) return;

    dispatch(order.clearOrder());
  }, [user, dispatch]);

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
