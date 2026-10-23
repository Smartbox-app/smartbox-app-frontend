import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FieldType, boxesList } from 'smartbox-tables';
import {
  AccessControl,
  BoxListRes,
  BoxStatus,
  RentStatus,
  UserRole,
} from 'smartbox-types';
import { Alert, ApiTable , ConfirmModal } from '../../../../../../../components/Common';
import { Button, Spinner } from '../../../../../../../components/Branded';
import {
  ButtonsContainer,
} from '../../../../../../../components/Layout';
import { __ } from '../../../../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../../../../utils/table-schema-utils';
import { boxDisplayStatusSearchValues } from '../../../../../../../utils/box-display-status';
import UserService from '../../../../../../../services/user-service';
import { showModal } from '../../../../../../../actions/modal';
import ApiService from '../../../../../../../services/api-service';
import {
  errorNotificationText,
  successNotification,
} from '../../../../../../../actions/notifications';
import { refreshApiTableData } from '../../../../../../../actions/api-table';
import { useParams } from 'react-router';
import { Edit } from '../Edit';
import BoxDetail from '../../../../../BoxDetail';
import { BoxStatus as BoxStatusBadge } from './BoxStatus';
import { AssignRentToUser } from '../../../../../AssignRentToUser';
import { useGetMyDetailsQuery, useGetStockQuery } from 'src/queries';
import { HeaderWithActions, Section } from 'src/components/ui';

const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { stockId } = useParams<{ stockId: string }>();
  const { data: stock } = useGetStockQuery(stockId);

  const hasFullAccess =
    !!user && [UserRole.admin, UserRole.client].includes(user.role);

  const deleteBox = async (boxId: string) => {
    setIsLoading(true);
    await ApiService.callFetch('DELETE', `box/${boxId}`, () => {
      dispatch(successNotification('application.boxDeleted'));
      dispatch(refreshApiTableData());
    });
    setIsLoading(false);
  };

  const openBox = async (boxId: string) => {
    setIsLoading(true);
    await ApiService.callFetch(
      'GET',
      `box/open/${boxId}`,
      (isSuccess: boolean) => {
        if (isSuccess) {
          dispatch(successNotification('application.boxOpenedSuccessfully'));
        } else {
          dispatch(errorNotificationText('application.cannotOpenBox'));
        }
      },
    );
    setIsLoading(false);
  };

  const confirmBoxDelete = (boxId: string) => {
    dispatch(
      showModal(
        <ConfirmModal
          approveButtonText="application.delete"
          mainText="application.deleteBoxText"
          approveAction={() => deleteBox(boxId)}
        />,
      ),
    );
  };

  const confirmBoxOpen = (boxId: string) => {
    dispatch(
      showModal(
        <ConfirmModal
          approveButtonText="application.openBox"
          mainText="application.openBoxConfirmation"
          approveAction={() => openBox(boxId)}
        />,
      ),
    );
  };

  const scheme = new InteractiveTableSchema(boxesList);
  scheme.highlightRow = (row) => row.status === RentStatus.toCheck;

  scheme
    .modifyFieldStatic('pricing', {
      name: __('application.pricingIsSet'),
      field: 'pricing',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, boxData: BoxListRes) =>
        boxData.pricing && boxData.pricing.length > 0 ? (
          <Alert compact type="success" text="application.yes" />
        ) : (
          <Alert compact type="error" text="application.no" />
        ),
    })
    .modifyFieldStatic('status', {
      name: __('application.state'),
      field: 'status',
      mobile: true,
      defaultSort: true,
      searchable: true,
      searchableValues: boxDisplayStatusSearchValues(),
      type: FieldType.Custom,
      customRender: (value, field, boxData: BoxListRes) => (
        <BoxStatusBadge box={boxData} stock={stock} />
      ),
    })
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      type: FieldType.Custom,
      mobile: true,
      customRender: (value, field, boxData: BoxListRes) => (
        <ButtonsContainer noWrap>
          {stock?.boxAccessControl && [AccessControl.keylessbox, AccessControl.ksm].includes(stock.boxAccessControl) && boxData.controlled ? (
            <Button
              text="application.openBox"
              click={() => confirmBoxOpen(boxData.id)}
            />
          ) : undefined}
          {hasFullAccess &&
          (!boxData.status || boxData.status === BoxStatus.free) ? (
            <Button
              secondary
              text="application.assignRent"
              click={() =>
                dispatch(showModal(<AssignRentToUser box={boxData} />))
              }
            />
          ) : null}
          <Button
            primary
            text="application.manage"
            click={() =>
              dispatch(showModal(<BoxDetail box={boxData} stockId={stockId} />))
            }
          />
          {hasFullAccess && (
            <>
              <Button
                secondary
                text="application.edit"
                click={() =>
                  dispatch(
                    showModal(
                      <Edit id={boxData.id} stockId={boxData.stockId} />,
                    ),
                  )
                }
              />
              <Button
                danger
                text="application.delete"
                click={() => confirmBoxDelete(boxData.id)}
              />
            </>
          )}
        </ButtonsContainer>
      ),
    });

  return (
    <Section>
      {isLoading && <Spinner overlay halfTransparent />}
      <HeaderWithActions
        actions={
          hasFullAccess && (
            <ButtonsContainer>
              <Button
                text="application.addBox"
                primary
                to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/boxes/add`}
              />
              <Button
                text="application.addBoxes"
                secondary
                to={`/${UserService.getSlugByRole(user.role)}/locations/stocks/${stockId}/boxes/add-multiple`}
              />
            </ButtonsContainer>
          )
        }
      >
        {__('application.boxesList')}
      </HeaderWithActions>

      <ApiTable
        scheme={scheme}
        apiEndpointSubUrl={`box/list/${stockId}`}
      />
    </Section>
  );
};

export { List };
