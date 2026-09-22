import React, { useState } from 'react';
import { MyRentList } from 'smartbox-types';
import { Pagination } from '../../../../components/Common';
import History from './History';
import { Header, Section } from '../../../../components/ui';
import { __ } from '../../../../helpers/i18n';
import { useGetMyRentStoryQuery } from 'src/queries';


const OrdersHistory = () => {
  const { data: rentsHistoryList = [] } = useGetMyRentStoryQuery();

  const [listLength, setListLength] = useState(10);
  const [page, setPage] = useState(1);

  const startFrom = (): number => (page - 1) * listLength;

  return (
    <Section>
      <Header variant="h2">{__('application.history')}</Header>
      <History
        data={rentsHistoryList.slice(startFrom(), startFrom() + listLength)}
      />
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
