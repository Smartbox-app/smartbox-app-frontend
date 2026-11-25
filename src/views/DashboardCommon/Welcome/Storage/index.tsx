import React from 'react';

import { MyRentList } from 'smartbox-types';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import type { NamingTypeKey } from 'src/i18n/types/keys';

import StorageList from './StorageList';

interface Props {
  myRentList: MyRentList[];
  loading: boolean;
  title: NamingTypeKey;
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
