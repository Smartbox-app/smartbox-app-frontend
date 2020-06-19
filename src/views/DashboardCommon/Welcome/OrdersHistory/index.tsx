import React from 'react';
import { MyRentList, RentStatus } from 'smartbox-types';
import { Section, SectionHeader } from '../../../../components/Layout';
import History from './History';

interface Props {
  rentHistory: MyRentList[];
}

const isItHistory = (status: RentStatus) => {
  if (status === RentStatus.failure || status === RentStatus.finished) {
    return true;
  } else {
    return false;
  }
};

const OrdersHistory = ({ rentHistory }: Props) => {
  const filterdHistory = rentHistory.filter((rent: MyRentList) => isItHistory(rent.status));
  return (
    <Section half>
      <SectionHeader title="Historia" />
      <History data={filterdHistory} />
    </Section>
  );
};

export default OrdersHistory;
