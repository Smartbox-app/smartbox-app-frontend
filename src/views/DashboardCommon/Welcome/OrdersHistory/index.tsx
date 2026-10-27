import { useState } from 'react';

import { Pagination } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useGetMyRentStoryQuery } from 'src/queries';
import History from './History';

const OrdersHistory = () => {
  const { data: rentsHistoryList = [] } = useGetMyRentStoryQuery();
  const listLength = 10;
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
