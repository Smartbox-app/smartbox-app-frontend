import React from 'react';
import { useDispatch } from 'react-redux';
import { FieldType, rentsList } from 'smartbox-tables';
import { AdminRentListDetails } from 'smartbox-types';
import { ApiTable } from '../../../../../../../components/Common';
import { Button } from '../../../../../../../components/Branded';
import {
  ButtonsContainer,
  SimpleHeader,
} from '../../../../../../../components/Layout';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import { showModal } from '../../../../../../../actions/modal';
import { useParams } from 'react-router';
import { RentHistoryModal } from './RentHistoryModal';
import {
  Button as UIButton,
  Header,
  Section,
  HeaderWithActions,
} from 'src/components/ui';
import { handleFileOpen } from 'src/utils/handle-file-open';
import { useTenant } from 'src/hooks/useTenant';

const List = () => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();

  const scheme = new InteractiveTableSchema(rentsList)
    .removeFields('description', 'id', 'userId')
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      type: FieldType.Custom,
      mobile: true,
      customRender: (value, field, rentData: AdminRentListDetails) => (
        <>
          {rentData.description &&
          Array.isArray(rentData.description) &&
          rentData.description.length > 0 ? (
            <Button
              primary
              text="application.rentHistory"
              click={() =>
                dispatch(
                  showModal(
                    <RentHistoryModal
                      rent={rentData}
                      description={rentData.description}
                    />,
                  ),
                )
              }
            />
          ) : undefined}
        </>
      ),
    });

  return (
    <Section>
      <Header variant="h2">{__('application.stockRents')}</Header>
      <p>
        Podsumowanie wynajmów jest wysyłane codziennie na adres e-mail konta
        franczyzobiorcy. Możesz również wygenerować raport ręcznie przy pomocy
        przycisku "Pobierz raport" z poziomu listy placów.
      </p>

      <ApiTable scheme={scheme} apiEndpointSubUrl={`rent/list/${stockId}`} />
    </Section>
  );
};

export { List };
