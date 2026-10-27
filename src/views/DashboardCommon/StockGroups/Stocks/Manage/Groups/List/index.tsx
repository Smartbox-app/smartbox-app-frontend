import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { FieldType, boxGroupsList } from 'smartbox-tables';
import { BoxGroupListRes } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button } from 'src/components/Branded';
import { Alert, ApiTable , ConfirmModal } from 'src/components/Common';
import {
  ButtonsContainer,
} from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useDeleteBoxGroupMutation } from 'src/mutations';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { Edit } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Groups/Edit';

const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const { mutate: deleteBoxGroup } = useDeleteBoxGroupMutation();
  const { stockId } = useParams<{ stockId: string }>();

  const confirmBoxGroupDelete = (groupId: string) => {
    dispatch(
      showModal(
        <ConfirmModal
          approveButtonText="application.delete"
          mainText="application.deleteGroupText"
          approveAction={() => deleteBoxGroup(groupId)}
        />,
      ),
    );
  };

  const scheme = new InteractiveTableSchema(boxGroupsList)
    .modifyFieldStatic('pricing', {
      name: __('application.pricingIsSet'),
      field: 'pricing',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, boxData: BoxGroupListRes) =>
        boxData.pricing && boxData.pricing.length > 0 ? (
          <Alert compact type="success" text="application.yes" />
        ) : (
          <Alert compact type="error" text="application.no" />
        ),
    })
    .modifyFieldStatic('maxRentPeriod', {
      name: __('application.maxRentPeriod'),
      field: 'maxRentPeriod',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, boxData: BoxGroupListRes) =>
        !boxData.maxRentPeriod ? '-' : boxData.maxRentPeriod,
    })
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: 'application.pricing',
          type: 'primary',
          to: (data) =>
            `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/groups/${(data as BoxGroupListRes).id}/pricing`,
          // click: (data: BoxGroupListRes) => dispatch(showModal(<Edit id={data.id} stockId={data.stockId} />)),
        },
        {
          name: 'application.edit',
          type: 'secondary',
          click: (data: BoxGroupListRes) =>
            dispatch(showModal(<Edit id={data.id} stockId={data.stockId} />)),
        },
        {
          name: 'application.delete',
          type: 'danger',
          click: (data: BoxGroupListRes) => confirmBoxGroupDelete(data.id),
        },
      ],
    });

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <Button
              text="application.addBoxGroup"
              primary
              to={`/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/groups/add`}
            />
          </ButtonsContainer>
        }
      >
        {__('application.boxGroupsList')}
      </HeaderWithActions>

      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`box-group-new/list/${stockId}`}
      />
    </Section>
  );
};

export { List };
