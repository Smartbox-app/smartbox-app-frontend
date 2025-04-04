import React from 'react';
import { MyRentList } from 'smartbox-types';
import StorageList from './StorageList';
import { Spinner } from '../../../../components/Branded';
import { Header, Section } from '../../../../components/ui';
import { __ } from '../../../../helpers/i18n';

interface Props {
  myRentList: MyRentList[];
  loading: boolean;
}

const Storage = ({ myRentList, loading }: Props) => (
  <Section>
    <Header variant="h2">{__('application.storeManagement')}</Header>
    {loading ? <Spinner /> : <StorageList list={myRentList} />}
  </Section>
);

export default Storage;
