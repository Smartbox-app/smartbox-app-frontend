import React from 'react';
import { MyRentList, RentStatus } from 'smartbox-types';
import { Section, SectionHeader } from '../../../../components/Layout';
import History from './History';

interface Props {
  rentHistory: MyRentList[];
}

const OrdersHistory = ({ rentHistory }: Props) => {
  const filterdHistory = rentHistory.filter((rent: MyRentList) => rent.status === RentStatus.finished);
  return (
    <Section half>
      <SectionHeader title="Historia" />
      <History data={filterdHistory} />
    </Section>
  );
};

export default OrdersHistory;
