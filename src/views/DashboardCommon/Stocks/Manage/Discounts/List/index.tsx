import React from 'react';
import { FieldType, discounTable, giftsListTable } from 'smartbox-tables';
import { useDispatch } from 'react-redux';
import { Section, ButtonsContainer } from '../../../../../../components/Layout';
import { Button } from '../../../../../../components/Branded';
import { InteractiveTableSchema } from '../../../../../../utils/table-schema-utils';
import { __ } from '../../../../../../helpers/i18n';
import { modal, notifications } from '../../../../../../actions';
import { StockDiscount } from '../StockDiscount';
import { GiftModal } from '../GiftModal';
import { useParams } from 'react-router';
import { ApiTable, ConfirmModal } from '../../../../../../components/Common';
import { GiftRes, GiftType } from '../../../../../../../../smartbox-back/types';
import ApiService from '../../../../../../services/api-service';
import { refreshApiTableData } from '../../../../../../actions/api-table';

const getType = (type: GiftType) => {
    switch (type) {
        case GiftType.ReducePeriodByPercent: return __('application.giftReducePeriodByPercent');
        case GiftType.ReducePeriodByValue: return __('application.giftReducePeriodByValue');
        case GiftType.ReducePeriodToPrice: return __('application.giftReducePeriodToPrice');
    }
}

const List = () => {
    const { stockId } = useParams<{ stockId: string }>();
    const dispatch = useDispatch();

    const deleteGift = async (id: string) => {
        await ApiService.callFetch('DELETE', `gift/${id}`, () => {
            dispatch(notifications.successNotification('application.giftDeleted'));
            dispatch(refreshApiTableData());
        })
    }

    const toggleGift = async (gift: GiftRes) => {
        await ApiService.callFetch('PATCH', `gift/${gift.id}/toggle`, (gift: GiftRes) => {
            if (gift.active) {
                dispatch(notifications.successNotification('application.giftActivated'));
            } else {
                dispatch(notifications.successNotification('application.giftDeactivated'));

            }
            dispatch(refreshApiTableData());
        })
    }

    const scheme = new InteractiveTableSchema(giftsListTable)
        .modifyFieldStatic('type', {
            name: __('application.giftType'),
            field: 'type',
            mobile: true,
            defaultSort: true,
            type: FieldType.Custom,
            customRender: (value, field, gift) => getType(gift.type),
            searchableValues: {
                [GiftType.ReducePeriodByPercent]:  getType(GiftType.ReducePeriodByPercent),
                [GiftType.ReducePeriodToPrice]:  getType(GiftType.ReducePeriodToPrice),
                [GiftType.ReducePeriodByValue]:  getType(GiftType.ReducePeriodByValue)
            }
        })
        .addFieldAtTheEnd({
            name: __('application.state'),
            field: 'active',
            mobile: true,
            defaultSort: true,
            type: FieldType.Custom,
            customRender: (value, field, gift) => (
                <Button
                    text={gift.active ? 'application.block' : 'application.active'}
                    success={!gift.active} danger={gift.active} click={() => toggleGift(gift)} />
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
                    click: (data: GiftRes) =>
                        dispatch(modal.showModal(
                            <ConfirmModal
                                approveButtonText='application.delete'
                                mainText='application.deleteGiftConfirmation'
                                approveAction={() => deleteGift(data.id)}
                            />,
                        )),
                },
            ],
        });

    return (
        <Section full>
            <StockDiscount />
            <ButtonsContainer>
                <Button text='application.createDiscountCode' primary click={() => dispatch(modal.showModal(<GiftModal stockId={stockId} />))} />
            </ButtonsContainer>
            <ApiTable scheme={scheme} apiEndpointSubUrl={`gift/list/${stockId}`} />
        </Section>
    );
}

export { List }
