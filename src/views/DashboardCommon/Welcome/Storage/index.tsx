import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import StorageList from './StorageList';
import { __ } from '../../../../helpers/i18n';
import { Spinner } from '../../../../components/Common';

interface Props {
  myRentList: any;
  loading: boolean;
}

const Storage = ({ myRentList, loading }: Props) => (
  <Section full>
    <SectionHeader title={__('application.storeManagement')} />
    {loading ? <Spinner /> : <StorageList list={myRentList} />}
  </Section>
);

export default Storage;
