import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { order } from '../../../../../../actions';
import { Section as InsideSection } from '../../../../../../components/Layout';
import { SingleOption } from './SingleOption';

import '../StepStock.scss';
import {
  useGetMyDetailsQuery,
  useGetStockGroupsListQuery,
  useGetStockListQuery,
} from 'src/queries';
import { Header, Skeleton } from '../../../../../../components/ui';

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
