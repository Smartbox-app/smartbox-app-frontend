import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DiscountList } from 'smartbox-types';
import { stock } from '../../../../actions';
import { ApplicationState } from '../../../../reducers';
import Discounts from './Discounts';
import { __ } from '../../../../helpers/i18n';
import { Header, Section } from '../../../../components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

interface Props {
  discountsList: DiscountList[];
  getStockDiscountsList: () => void;
}

const Sale = ({ discountsList, getStockDiscountsList }: Props) => {
  const { getText } = useTenantNaming();
  useEffect(() => {
    getStockDiscountsList();
  }, []);

  const discounts = useMemo(() => {
    return discountsList
      .filter((d) => !!d.discount)
      .map(
        (d) =>
          `${__('application.discount')} ${d.discount}% ${getText('on')} ${d.name}`,
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

const mapStateToProps = (state: ApplicationState) => ({
  discountsList: state.stock.discountsList,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...stock,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Sale);
