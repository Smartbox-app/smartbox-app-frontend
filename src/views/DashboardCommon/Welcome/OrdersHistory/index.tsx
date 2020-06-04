import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import History from './History';

const OrdersHistory = () => (
  <Section half>
    <SectionHeader title="Historia" />
    <History
      data={[
        {
          startDate: new Date(),
          endDate: new Date(),
          size: 12,
          location: 'Warszawa, Mokotów',
          isActive: true,
        },
        {
          startDate: new Date(),
          endDate: new Date(),
          size: 3,
          location: 'Wrocław, Fabryczna',
          isActive: false,
        },
        {
          startDate: new Date(),
          endDate: new Date(),
          size: 6,
          location: 'Poznań, Jeżyce',
          isActive: false,
        },
      ]}
    />
  </Section>
);

export default OrdersHistory;
