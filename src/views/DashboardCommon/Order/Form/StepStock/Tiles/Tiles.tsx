import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { order } from '../../../../../../actions';
import { Section as InsideSection } from '../../../../../../components/Layout';
import SingleOption from './SingleOption';
import { ApplicationState } from '../../../../../../reducers';

import '../StepStock.scss';
import { useGetMyDetailsQuery } from 'src/queries';
import { Header } from '../../../../../../components/ui';
import { __ } from '../../../../../../helpers/i18n';

export const Tiles = () => {
  const dispatch = useDispatch();
  const list = useSelector((state: ApplicationState) => state.stock.list);
  const groupsList = useSelector(
    (state: ApplicationState) => state.stockGroup.list,
  );
  const { data: user } = useGetMyDetailsQuery();

  useEffect(() => {
    if (!user) return;

    dispatch(order.clearOrder());
  }, []);

  if (!user) return null;
  return (
    <>
      {groupsList.map((group) => (
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
        {list.map((el) => (
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