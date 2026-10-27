import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { FieldType, boxesList } from 'smartbox-tables';
import {
  AccessControl,
  BoxListRes,
  BoxStatus,
  RentStatus,
  UserRole,
} from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Button, Spinner } from 'src/components/Branded';
import { Alert, ApiTable , ConfirmModal } from 'src/components/Common';
import {
  ButtonsContainer,
} from 'src/components/Layout';
import { HeaderWithActions, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import {
  useDeleteBoxMutation,
  useOpenBoxMutation,
} from 'src/mutations';
import { useGetMyDetailsQuery, useGetStockQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { boxDisplayStatusSearchValues } from 'src/utils/box-display-status';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { AssignRentToUser } from '../../../../../AssignRentToUser';
import BoxDetail from '../../../../../BoxDetail';
import { Edit } from '../Edit';
import { BoxStatus as BoxStatusBadge } from './BoxStatus';

const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const dispatch = useDispatch();
  const { mutate: deleteBox, isPending: isDeleting } = useDeleteBoxMutation();
  const { mutate: openBox, isPending: isOpening } = useOpenBoxMutation();
  const isLoading = isDeleting || isOpening;
  const { stockId } = useParams<{ stockId: string }>();
  const { data: stock } = useGetStockQuery(stockId);

  const hasFullAccess =
    !!user && [UserRole.admin, UserRole.client].includes(user.role);

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
