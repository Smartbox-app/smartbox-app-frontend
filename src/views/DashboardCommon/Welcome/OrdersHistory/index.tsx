import React from 'react';
import { MyRentList, RentStatus } from 'smartbox-types';
import { Section, SectionHeader } from '../../../../components/Layout';
import History from './History';
import { __ } from '../../../../helpers/i18n';

interface Props {
  rentHistory: MyRentList[];
}

const OrdersHistory = ({ rentHistory }: Props) => {
  const filteredHistory = rentHistory.filter((rent: MyRentList) => rent.status !== RentStatus.failure);
  return (
    <Section half>
      <SectionHeader title={__('application.history')} />
      <History data={filteredHistory} />
    </Section>
  );
};

export default OrdersHistory;
