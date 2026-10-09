import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStockDiscountsList } from '../../../../actions/stock';
import { ApplicationState } from '../../../../reducers';
import Discounts from './Discounts';
import { __ } from '../../../../helpers/i18n';
import { Header, Section } from '../../../../components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

const Sale = () => {
  const dispatch = useDispatch();
  const discountsList = useSelector(
    (state: ApplicationState) => state.stock.discountsList,
  );
  const { getText } = useTenantNaming();
  useEffect(() => {
    dispatch(getStockDiscountsList());
  }, [dispatch]);

  const discounts = useMemo(() => {
    return discountsList
      .filter((d) => !!d.value)
      .map(
        (d) =>
          `${__('application.discount')} ${d.value}% ${getText('on')} ${d.name}`,
      );
  }, [discountsList]);

  if (discounts.length === 0) return null;

  return (
    <Section>
      <Header variant="h2">{__('application.discounts')}</Header>
      <Discounts discounts={discounts} />
    </Section>
  );
};

export default Sale;
