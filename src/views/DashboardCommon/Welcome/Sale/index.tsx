import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DiscountList, UserRes } from 'smartbox-types';
import { stock } from '../../../../actions';
import { Section, SectionHeader } from '../../../../components/Layout';
import { ApplicationState } from '../../../../reducers';
import Discounts from './Discounts';
import { __ } from '../../../../helpers/i18n';
import { firstRentChecker } from '../../../../utils/isFirstRent';

interface Props {
  discountsList: DiscountList[];
  getStockDiscountsList: () => void;
  user: UserRes;
}

const Sale = ({ discountsList, getStockDiscountsList, user }: Props) => {
  useEffect(() => {
    getStockDiscountsList();
  }, []);

  const isFirstWeekSale = () => {
    return firstRentChecker(user);
  };

  const createText = (list: DiscountList[]) => {
    const result = isFirstWeekSale()
      ? ['Pierwszy tydzień za 1zł. Promocja obowiązuje tylko przy płatności kartą.']
      : [];

    list.forEach((el: any) => {
      if (el.discount) result.push(`Zniżka ${el.discount}% na placu: ${el.name}`);
    });
    return result;
  };

  return (
    <Section full highlight>
      <SectionHeader title={__('application.discounts')} />
      <Discounts discounts={createText(discountsList)} />
    </Section>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  discountsList: state.stock.discountsList,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...stock,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Sale);
