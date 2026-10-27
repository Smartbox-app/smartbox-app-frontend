import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { FieldType, giftsListTable } from 'smartbox-tables';
import { GiftListRes, GiftType } from 'smartbox-types';
import { modal } from 'src/actions';
import { Button } from 'src/components/Branded';
import { ApiTable, ConfirmModal } from 'src/components/Common';
import {
  Section,
  ButtonsContainer,
} from 'src/components/Layout';
import { HeaderWithActions } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import {
  useDeleteGiftMutation,
  useToggleGiftMutation,
} from 'src/mutations';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { GiftModal } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Discounts/GiftModal';
import { StockDiscount } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Discounts/StockDiscount';

const getType = (type: GiftType) => {
  switch (type) {
    case GiftType.ReducePeriodByPercent:
      return __('application.giftReducePeriodByPercent');
    case GiftType.ReducePeriodByValue:
      return __('application.giftReducePeriodByValue');
    case GiftType.ReducePeriodToPrice:
      return __('application.giftReducePeriodToPrice');
  }
};

const List = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const dispatch = useDispatch();
  const { mutate: deleteGift } = useDeleteGiftMutation();
  const { mutate: toggleGift } = useToggleGiftMutation();

  const scheme = new InteractiveTableSchema(giftsListTable)
    .modifyFieldStatic('type', {
      name: __('application.giftType'),
      field: 'type',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, gift: GiftListRes) => getType(gift.type),
      searchableValues: {
        [GiftType.ReducePeriodByPercent]: getType(
          GiftType.ReducePeriodByPercent,
        ),
        [GiftType.ReducePeriodToPrice]: getType(GiftType.ReducePeriodToPrice),
        [GiftType.ReducePeriodByValue]: getType(GiftType.ReducePeriodByValue),
      },
    })
    .addFieldAtTheEnd({
      name: __('application.state'),
      field: 'active',
      mobile: true,
      defaultSort: true,
      type: FieldType.Custom,
      customRender: (value, field, gift: GiftListRes) => (
        <Button
          text={gift.active ? 'application.block' : 'application.active'}
          success={!gift.active}
          danger={gift.active}
          click={() => toggleGift(gift)}
        />
      ),
    })
    .addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: 'application.delete',
          type: 'danger',
          click: (data: GiftListRes) =>
            dispatch(
              modal.showModal(
                <ConfirmModal
                  approveButtonText="application.delete"
                  mainText="application.deleteGiftConfirmation"
                  approveAction={() => deleteGift(data.id)}
                />,
              ),
            ),
        },
      ],
    });

  if (!stockId) return null;

  return (
    <>
      <Section>
        <StockDiscount />
      </Section>
      <Section>
        <HeaderWithActions
          actions={
            <ButtonsContainer>
              <Button
                text="application.createDiscountCode"
                primary
                click={() =>
                  dispatch(modal.showModal(<GiftModal stockId={stockId} />))
                }
              />
            </ButtonsContainer>
          }
        >
          {__('application.discountsCodes')}
        </HeaderWithActions>

        <ApiTable scheme={scheme} apiEndpointSubUrl={`gift/list/${stockId}`} />
      </Section>
    </>
  );
};

export { List };
