import React, { useEffect } from 'react';
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
  const {getText} = useTenantNaming();
  useEffect(() => {
    getStockDiscountsList();
  }, []);

  const createText = (list: DiscountList[]) => {
    const result: string[] = [];

    list.forEach((el: any) => {
      if (el.discount) result.push(`${__('application.discount')} ${el.discount}% ${getText('on')} ${el.name}`);
    });
    return result;
  };

  return (
    <Section>
      <Header variant='h2'>{__('application.discounts')}</Header>
      <Discounts discounts={createText(discountsList)} />
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
