import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import StorageList from './StorageList';

const Storage = () => (
  <Section full>
    <SectionHeader title="Zarządaj magazynami" />
    <StorageList
      list={[
        // {
        //   size: 12,
        //   location: 'Warszawa, Mokotów',
        // },
        // {
        //   size: 6,
        //   location: 'Wrocław, Fabryczna',
        // },
        // {
        //   size: 6,
        //   location: 'Wrocław, Fabryczna',
        // },
        // {
        //   size: 6,
        //   location: 'Wrocław, Fabryczna',
        // },
        // {
        //   size: 6,
        //   location: 'Wrocław, Fabryczna',
        // },
        {
          size: 6,
          location: 'Wrocław, Fabryczna',
        },
      ]}
    />
  </Section>
);

export default Storage;
