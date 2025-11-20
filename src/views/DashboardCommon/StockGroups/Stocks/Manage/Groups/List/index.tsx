import React from 'react';
import { useDispatch } from 'react-redux';
import { FieldType, boxGroupsList } from 'smartbox-tables';
import { BoxGroupListRes } from 'smartbox-types';
import { Alert, ApiTable } from '../../../../../../../components/Common';
import { Button } from '../../../../../../../components/Branded';
import {
  ButtonsContainer,
  SimpleHeader,
} from '../../../../../../../components/Layout';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import UserService from '../../../../../../../services/user-service';
import { showModal } from '../../../../../../../actions/modal';
import { ConfirmModal } from '../../../../../../../components/Common';
import ApiService from '../../../../../../../services/api-service';
import { successNotification } from '../../../../../../../actions/notifications';
import { refreshApiTableData } from '../../../../../../../actions/api-table';
import { useParams } from 'react-router';
import { Edit } from '../Edit';
import { useGetMyDetailsQuery } from 'src/queries';
import { HeaderWithActions, Section } from 'src/components/ui';

const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const { stockId } = useParams<{ stockId: string }>();

  const deleteGroup = async (boxGroupId: string) => {
    await ApiService.callFetch('DELETE', `box-group-new/${boxGroupId}`, () => {
      dispatch(successNotification('application.boxGroupDeleted'));
      dispatch(refreshApiTableData());
    });
  };

  const confirmBoxGroupDelete = (groupId: string) => {
    dispatch(
      showModal(
        <ConfirmModal
          approveButtonText="application.delete"
          mainText="application.deleteGroupText"
          approveAction={() => deleteGroup(groupId)}
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
      customRender: (value, field, boxData) =>
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
          to: (data: BoxGroupListRes) =>
            `/${UserService.getSlugByRole(user!.role)}/locations/stocks/${stockId}/groups/${data.id}/pricing`,
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
