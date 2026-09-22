import React, { useMemo } from 'react';
import { AdminRentListDetails, RentStatus } from 'smartbox-types';
import { FieldType, rentsList } from 'smartbox-tables';
import { ApiTable } from '../../../../../../../components/Common';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import {
  rentStatusSearchValues,
  translateBoxDisplayStatus,
} from '../../../../../../../utils/box-display-status';
import { Header, Section } from 'src/components/ui';
import { RentListRowActions } from './RentListRowActions';
import { useParams } from 'react-router';

const List = () => {
  const { stockId } = useParams<{ stockId: string }>();

  const scheme = useMemo(() => {
    const base = new InteractiveTableSchema(rentsList);
    base.highlightRow = (row) => row.status === RentStatus.toCheck;

    return base
    .removeFields('description', 'id', 'userId')
    .modifyFieldStatic('status', {
      searchableValues: rentStatusSearchValues(),
      customValue: (row) => translateBoxDisplayStatus(row.status),
    })
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      type: FieldType.Custom,
      mobile: true,
      customRender: (_value, _field, rentData: AdminRentListDetails) => (
        <RentListRowActions rent={rentData} />
      ),
    });
  }, []);

  return (
    <Section>
      <Header variant="h2">{__('application.stockRents')}</Header>
      <p>
        Podsumowanie wynajmów jest wysyłane codziennie na adres e-mail konta
        franczyzobiorcy. Możesz również wygenerować raport ręcznie przy pomocy
        przycisku „Pobierz raport” z poziomu listy placów.
      </p>

      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`rent/list/${stockId}`}
      />
    </Section>
  );
};

export { List };
