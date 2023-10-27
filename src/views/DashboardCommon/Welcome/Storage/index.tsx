import React from 'react';
import { MyRentList } from 'smartbox-types';
import { Section, SectionHeader } from '../../../../components/Layout';
import StorageList from './StorageList';
import { Spinner } from '../../../../components/Branded';

interface Props {
  myRentList: MyRentList[];
  loading: boolean;
}

const Storage = ({ myRentList, loading }: Props) => (
  <Section full highlight>
    <SectionHeader title='application.storeManagement' />
    {loading ? <Spinner /> : <StorageList list={myRentList} />}
  </Section>
);

export default Storage;
