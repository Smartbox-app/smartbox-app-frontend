import React from 'react';
import { Section, SectionHeader } from '../../../../components/Layout';
import StorageList from './StorageList';
import { __ } from '../../../../helpers/i18n';

interface Props {
  myRentList: any;
}

const Storage = ({ myRentList }: Props) => (
  <Section full>
    <SectionHeader title={__('application."Zarządaj magazynami"')} />
    <StorageList list={myRentList} />
  </Section>
);

export default Storage;
