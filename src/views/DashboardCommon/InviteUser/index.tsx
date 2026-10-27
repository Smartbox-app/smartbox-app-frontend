import React from 'react';

import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import { InviteUserForm } from './InviteUserForm';

const InviteUser = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  return (
    <Section>
      <Header variant="h2">{__('application.preInvitation')}</Header>
      <InviteUserForm  />
    </Section>
  );
};

export default InviteUser;
