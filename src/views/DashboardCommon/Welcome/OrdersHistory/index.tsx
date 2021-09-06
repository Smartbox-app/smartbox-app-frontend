import React, { useState } from 'react';
import { MyRentList } from 'smartbox-types';
import { Pagination } from '../../../../components/Common';
import { Section, SectionHeader } from '../../../../components/Layout';
import History from './History';
import { __ } from '../../../../helpers/i18n';

interface Props {
  rentsHistoryList: MyRentList[];
}

const OrdersHistory = ({ rentsHistoryList }: Props) => {
  const [listLength, setListLength] = useState(10);
  const [page, setPage] = useState(1);

  const startFrom = (): number => (page - 1) * listLength;

  return (
    <Section half highlight>
      <SectionHeader title={__('application.history')} />
      <History data={rentsHistoryList.slice(startFrom(), startFrom() + listLength)} />
      {rentsHistoryList.length > listLength && (
        <Pagination
          initialPage={1}
          pageCount={Math.ceil(rentsHistoryList.length / listLength)}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </Section>
  );
};

export default OrdersHistory;
