import React from 'react';
import { MyRentList } from 'smartbox-types';
import StorageList from './StorageList';
import { Header, Section } from '../../../../components/ui';
import { __ } from '../../../../helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

interface Props {
  myRentList: MyRentList[];
  loading: boolean;
  title: string;
}

const Storage = ({ myRentList, loading, title }: Props) => {
  const { getText } = useTenantNaming();
  const heading = getText(title);
  return (
    <Section>
      <Header variant="h2">{heading}</Header>
      <StorageList loading={loading} list={myRentList} />
    </Section>
  );
};
export default Storage;
