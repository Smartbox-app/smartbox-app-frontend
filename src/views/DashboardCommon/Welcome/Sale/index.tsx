import React, { useMemo } from 'react';

import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { useStockDiscountsQuery } from 'src/queries';

import Discounts from './Discounts';

const Sale = () => {
  const { data: discountsList = [] } = useStockDiscountsQuery();
  const { getText } = useTenantNaming();

  const discounts = useMemo(() => {
    return discountsList
      .filter((d) => !!d.value)
      .map(
        (d) =>
          `${__('application.discount')} ${d.value}% ${getText('on')} ${d.name}`,
      );
  }, [discountsList, getText]);

  if (discounts.length === 0) return null;

  return (
    <Section>
      <Header variant="h2">{__('application.discounts')}</Header>
      <Discounts discounts={discounts} />
    </Section>
  );
};

export default Sale;
