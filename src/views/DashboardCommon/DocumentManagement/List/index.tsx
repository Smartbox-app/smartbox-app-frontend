import React from 'react';
import { documentList } from 'smartbox-tables';
import { DocumentListRes } from 'smartbox-types';
import { history } from 'src/App';
import { Button } from 'src/components/Branded';
import { ApiTable } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';

import { __ } from 'src/helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

export const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const scheme = new InteractiveTableSchema(documentList).addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        mobile: true,
        buttons: [
          {
            name: 'application.edit',
            type: 'primary',
            click: (data: DocumentListRes) =>
              history.push(`/${UserService.getSlugByRole(user?.role)}/management/documents/${data.id}`)
          },
  
        ],
      });;

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              text="application.addDocument"
              primary
              to={`/${UserService.getSlugByRole(user!.role)}/management/documents/add`}
            />
          </ButtonsContainer>
        }
      >
        {__('application.documentList')}
      </HeaderWithActions>

      <ApiTable scheme={scheme} apiEndpointSubUrl={`document`} />
    </Section>
  );
};
