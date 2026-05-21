import React from 'react';
import { useDispatch } from 'react-redux';
import { AdminRentListDetails, UserRole } from 'smartbox-types';
import { FieldType, rentsList } from 'smartbox-tables';
import { ApiTable } from '../../../../../../../components/Common';
import { Button } from '../../../../../../../components/Branded';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import { showModal } from '../../../../../../../actions/modal';
import { useParams } from 'react-router';
import { RentHistoryModal } from './RentHistoryModal';
import { RentAuthorizationsForRentModal } from '../../RentAuthorizations/modals/RentAuthorizationsForRentModal';
import { Button as UIButton, Header, Section } from 'src/components/ui';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

import { ButtonsContainer } from 'src/components/Layout';

const List = () => {
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  const slug = UserService.getSlugByRole(user.role);

  const openAuthorizationsModal = (rentData: AdminRentListDetails) => {
    dispatch(
      showModal(
        <RentAuthorizationsForRentModal stockId={stockId} rent={rentData} />,
      ),
    );
  };
  const scheme = new InteractiveTableSchema(rentsList)
    .removeFields('description', 'id', 'userId')
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      type: FieldType.Custom,
      mobile: true,
      customRender: (value, field, rentData: AdminRentListDetails) => (
        <ButtonsContainer noWrap>
          <UIButton
            variant="secondary"
            type="button"
            text="application.rentPeriods"
            to={`/${slug}/locations/stocks/${stockId}/rents/${rentData.id}/periods`}
          />
          {[UserRole.admin, UserRole.client].includes(user.role) ? (
            <UIButton
              variant="secondary"
              type="button"
              text="application.rentAuthorizationsRowButton"
              onClick={() => openAuthorizationsModal(rentData)}
            />
          ) : null}
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
          ) : null}
        </ButtonsContainer>
      ),
    });

  return (
    <Section>
      <Header variant="h2">{__('application.stockRents')}</Header>
      <p>
        Podsumowanie wynajmów jest wysyłane codziennie na adres e-mail konta
        franczyzobiorcy. Możesz również wygenerować raport ręcznie przy pomocy
        przycisku „Pobierz raport” z poziomu listy placów.
      </p>

      <ApiTable scheme={scheme} apiEndpointSubUrl={`rent/list/${stockId}`} />
    </Section>
  );
};

export { List };
