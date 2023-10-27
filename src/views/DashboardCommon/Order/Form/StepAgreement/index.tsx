import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RentBoxReq, UserRole, IPricingResult, UserRes, ExtendRentalReq } from 'smartbox-types';
import { PaymentType } from 'smartbox-types';
import { Alert } from '../../../../../components/Common';
import { Button } from '../../../../../components/Branded';
import { order } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';

import ScrollPosition from './ScrollPosition';
import { ApplicationState } from '../../../../../reducers';

import './StepAgreement.scss';

interface RouteProps {
    step: string;
    rentId: string;
}

interface Props extends RouteComponentProps<RouteProps> {
    formData: FormType;
    countedPrice: IPricingResult;
    user: UserRes | null;
    isAgreementAccepted: boolean;
    isResignationMarked: boolean;
    stockId: string;
    paymentType: PaymentType;
    sentExtendRentRequest: (rentId: string, data: ExtendRentalReq, role: UserRole) => void;
    sentRentBoxRequest: (data: RentBoxReq, nextStep: string, role: UserRole) => void;
}

const StepSummary = ({
    formData,
    user,
    isResignationMarked,
    sentRentBoxRequest,
    countedPrice,
    stockId,
    match,
    paymentType,
    sentExtendRentRequest,
}: Props): any => {
    useEffect(() => {
        if(!user) return;
        if (!formData.size) {
            history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
        }
    }, []);

    const { handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        if(!user) return;
        const commonCollection = {
            finishAt: formData.dateEnd,
            cost: countedPrice.value,
            discountCode: formData.discountCode,
            firstName: formData.firstName,
            lastName: formData.lastName,
            street: formData.street,
            city: formData.city,
            postCode: formData.postCode,
            isCompany: formData.isCompany || false,
            phone: formData.phone,
            mailToSendInvoice: formData.mailToSendInvoice,
            companyName: formData.companyName || '',
            companyStreet: formData.companyStreet || '',
            companyCity: formData.companyCity || '',
            companyPostCode: formData.companyPostCode || '',
            nip: formData.nip || '',
        };

        const dataCollectionExtendRent: ExtendRentalReq = {
            ...commonCollection,
            isPaySavedCard: false,
            type: paymentType,
        };

        const dataCollectionRent: RentBoxReq = {
            ...commonCollection,
            startAt: formData.dateStart,
            stockId: stockId,
            size: Number(formData.size),
            type: paymentType,
        };

        if (match.params.rentId) {
            // rent extension
            sentExtendRentRequest(match.params.rentId, dataCollectionExtendRent, user.role);
        } else {
            // new Rent blik/creditcart
            sentRentBoxRequest(dataCollectionRent, 'payment', user.role);
        }
    };

    const onBack = () => {
        if(!user) return;
        history.push(`/${UserService.getSlugByRole(user.role)}/order/step/summary/${match.params.rentId || ''}`);
    };
    const desktop = window.matchMedia('(min-width: 920px)').matches;
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormHeader title="application.orderAgreement" />
            {/* <AgreementWrapper /> */}
            {desktop && (
                <object
                    className="rules-embed"
                    data="/assets/2022_02_01_Regulamin_aplikacji_SmartBox.pdf#toolbar=0&navpanes=0&scrollbar=0"
                    type="application/pdf"
                />
            )}
            <a
                className="button button-primary"
                target="_blank"
                href="/assets/2022_02_01_Regulamin_aplikacji_SmartBox.pdf"
                title="Regulamin"
            >
                Kliknij aby otworzyć regulamin
            </a>
            <span className="separator" />
            <ScrollPosition />
            <Alert type="notice" text="application.orderAgreementAcceptation" />
            <ButtonsContainer max>
                <Button outline text="application.back" click={() => onBack()} />
                <Button type="submit" primary text="application.goToPayment" disabled={!isResignationMarked} />
            </ButtonsContainer>
        </form>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    formData: state.order.formData,
    countedPrice: state.order.countedPrice,
    user: state.user.details,
    isResignationMarked: state.order.isResignationMarked,
    stockId: state.order.formData.stock,
    rentId: state.rent.singleRent.id,
    selectedPaymentMethodDetailId: state.order.selectedPaymentMethodDetail.id,
    paymentType: state.order.selectedPayment,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            ...order,
        },
        dispatch,
    );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepSummary));
