import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DiscountList } from 'smartbox-types';
import { stock } from '../../../../actions';
import { Section, SectionHeader } from '../../../../components/Layout';
import { ApplicationState } from '../../../../reducers';
import Discounts from './Discounts';
import { __ } from '../../../../helpers/i18n';

interface Props {
  discountsList: DiscountList[];
  getStockDiscountsList: () => void;
}

const Sale = ({ discountsList, getStockDiscountsList }: Props) => {
  useEffect(() => {
    getStockDiscountsList();
  }, []);

  const createText = (list: DiscountList[]) => {
    const result = ['Pierwszy tydzień za 1zł'];
    list.forEach((el: any) => {
      result.push(`Zniżka ${el.discount}% na placu: ${el.name}`);
    });
    return result;
  };

  return (
    <Section full>
      <SectionHeader title={__('application.discounts')} />
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
