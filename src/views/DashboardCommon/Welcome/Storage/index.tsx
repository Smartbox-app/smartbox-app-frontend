import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import StorageList from './StorageList';

interface Props {
  myRentList: any;
}

const Storage = ({ myRentList }: Props) => (
  <Section full>
    <SectionHeader title="Zarządaj magazynami" />
    <StorageList list={myRentList} />
  </Section>
);

export default Storage;
