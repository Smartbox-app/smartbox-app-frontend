import React from 'react';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentDetails, RentStatus } from 'smartbox-types';
import { FormType } from '../../../../types/order-form';
import { modal, order, singleRent, notifications } from '../../../../actions';
import { history } from '../../../../App';
import { Button } from '../../../../components/Branded';
import { ButtonsContainer } from '../../../../components/Layout';
import { ApplicationState } from '../../../../reducers';
import UserService from '../../../../services/user-service';
import EndingModal from './EndingModal';

interface Props {
    isMapActive: boolean;
    showUserStockMap: boolean;
    rent: MyRentDetails;
    showModal: (content: React.ReactNode) => void;
    endMyRent: (rentId: string) => void;
    updateFormData: (data: Partial<FormType>) => void;
    successNotification: (text: string) => void;
    getMyRentList: () => void;
    toggleShowUserStockMap: () => void;
    clearOrder: () => void;
}

const Action = ({
    showModal,
    updateFormData,
    rent,
    clearOrder,
    showUserStockMap,
    toggleShowUserStockMap,
    isMapActive
}: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details!);

    const handleExtendingOrderData = (rentId: string) => {
        clearOrder();
        updateFormData({ size: rent.size.toString(), stock: rent.stockId });
        history.push(`/${UserService.getSlugByRole(user.role)}/order/step/duration/${rentId}`);
    };

    return (
        <ButtonsContainer max>
            {isMapActive ? <Button
                text={!showUserStockMap ? 'application.showOnStockMap' : 'application.showDetail'}
                success
                click={() => toggleShowUserStockMap()}
            /> : null}
            <Button
                text='application.goToAgreement'
                success
                click={() => handleExtendingOrderData(rent.id)}
                disabled={rent.status !== RentStatus.rented}
            />
            <Button text='application.end' danger click={() => showModal(<EndingModal rent={rent} />)} />
            <Button text='application.back' primary to={`/${UserService.getSlugByRole(user.role)}`} />
        </ButtonsContainer>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    showUserStockMap: state.rent.showUserStockMap,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            ...modal,
            ...singleRent,
            ...order,
            ...notifications,
        },
        dispatch,
    );

export default connect(mapStateToProps, mapDispatchToProps)(Action);
