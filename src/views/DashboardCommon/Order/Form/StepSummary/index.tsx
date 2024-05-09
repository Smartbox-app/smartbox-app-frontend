import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';
import { PaymentType } from 'smartbox-types';
import { CheckBox } from '../../../../../components/Common';
import { Button, Spinner } from '../../../../../components/Branded';
import { order, modal, notifications, user } from '../../../../../actions';
import { ButtonsContainer } from '../../../../../components/Layout';
import { history } from '../../../../../App';
import { FormType } from '../../../../../types/order-form';

import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { __ } from '../../../../../helpers/i18n';
import CompanyDetailsForm from './CompanyDetailsForm';

import { DiscountsList } from './DiscountsList';
import PaymentMethods from './PaymentMethods';
import SummaryTable from './SummaryTable';
import TenantDetailsForm from './TenantDetailsForm';

import './StepSummary.scss';
import { calculatePrice } from '../../../../../actions/order';

interface Props {
    formData: FormType;
    selectedPaymentMethod: any;
    selectedPayment: PaymentType;
    updateFormData: (data: Partial<FormType>) => void;
    fetchMyData: () => void;
    showModal: (content: React.ReactNode) => void;
    successNotification: (text: string) => void;
}

const StepSummary = ({
    formData,
    fetchMyData,
    updateFormData,
    selectedPaymentMethod,
    selectedPayment,
    successNotification,
}: Props) => {
    const dispatch = useDispatch();
    const [invoiceNeeded, setInvoiceNeeded] = useState(false);
    const { calculatedPrice, calculatedPriceDetails, loadingPrice, discountCode, stockId, boxGroupId, startDate, endDate } = useSelector((state: ApplicationState) => state.order);
    const user = useSelector((state: ApplicationState) => state.user.details!);
    const { step, rentId } = useParams<{ step: string, rentId: string }>();
    const isFirstRent = user && !user.rentCount;

    useEffect(() => {
        fetchMyData();
        if (!stockId || !boxGroupId) {
            history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
        }
        if (formData.nip) {
            setInvoiceNeeded(true);
        }

        if (!isFirstRent) {
            if (user.companyData && user.companyData.nip) {
                setInvoiceNeeded(true);
            } else {
                setInvoiceNeeded(false);
            }
        }

        dispatch(calculatePrice(boxGroupId, startDate, endDate));
    }, []);

    useEffect(() => {
        dispatch(calculatePrice(boxGroupId, startDate, endDate, discountCode));
    }, [discountCode])


    const defaultValues = {
        paymentType: `${selectedPayment || PaymentType.card}`,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        street: user?.street || '',
        city: user?.city || '',
        postCode: user?.postCode || '',
        mailToSendInvoice: user?.email || '',
        phone: user?.phone || '',

        nip: user?.companyData.nip || '',
        companyPostCode: user?.companyData.companyPostCode || '',
        companyCity: user?.companyData.companyCity || '',
        companyStreet: user?.companyData.companyStreet || '',
        companyName: user?.companyData.companyName || '',
    };

    const { handleSubmit, register, watch, control, errors } = useForm({ defaultValues });

    const tenantData = (): boolean => {
        if (
            watch().firstName !== '' &&
            watch().lastName !== '' &&
            watch().street !== '' &&
            watch().city !== '' &&
            watch().postCode !== '' &&
            watch().mailToSendInvoice !== '' &&
            watch().phone !== ''
        ) {
            if (!errors.mailToSendInvoice && !errors.postCode) {
                return false;
            }
        }
        return true;
    };

    const companyData = (): boolean => {
        if (invoiceNeeded) {
            if (
                watch().companyName !== '' &&
                watch().companyStreet !== '' &&
                watch().companyCity !== '' &&
                watch().companyPostCode !== '' &&
                watch().nip !== ''
            ) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    };

    const onSubmit = (data: any) => {
        updateFormData({ ...data, isCompany: invoiceNeeded });
        history.push(`/${UserService.getSlugByRole(user.role)}/order/step/agreement/${rentId || ''}`);
    };

    const paymentChangeOnly = (e: any): boolean => {
        switch (e.target.id) {
            case 'paymentTypeBlik': {
                return true;
            }
            case 'paymentTypeCard': {
                return true;
            }
            case 'paymentTypeBank': {
                return true;
            }
            default:
                return false;
        }
    };

    const handleChange = (e: any) => {
        // if (isFirstRent) {
        //     if (paymentChangeOnly(e)) {
        //         if (Number(watch().paymentType) !== PaymentType.card) {
        //             if (countedPrice?.name === 'firstRentFreePricing') {
        //                 successNotification('notification.firstWeekForOneOnlyCard');
        //                 updateFormData({
        //                     isFirstRent: false,
        //                 });
        //             }
        //         } else {
        //             updateFormData({
        //                 isFirstRent: true,
        //             });
        //             successNotification('notification.firstWeekForOneActive');
        //         }
        //     }
        // }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-step-two" onChange={handleChange}>
            {loadingPrice && <Spinner overlay halfTransparent />}
            <DiscountsList stockId={stockId} />
            <FormHeader title="application.orderSummary" />
            <SummaryTable dateStart={startDate} dateEnd={endDate} countedPrice={calculatedPrice} />
            {/* {calculatedPrice > 0 && <PaymentMethods register={register} />} */}

            <TenantDetailsForm register={register} control={control} errors={errors} disabled={!isFirstRent} />
            {isFirstRent && (
                <>
                    <p>{__('application.infoToOptionalInvoice')}</p>
                    <CheckBox
                        name="iNeedInvoice"
                        checked={invoiceNeeded}
                        handleChange={() => setInvoiceNeeded(!invoiceNeeded)}
                        label="application.wantOptionalInvoice"
                    />
                </>
            )}
            {invoiceNeeded && (
                <CompanyDetailsForm register={register} errors={errors} control={control} disabled={!isFirstRent} />
            )}

            <ButtonsContainer max>
                <Button outline text="application.back" to={`/${UserService.getSlugByRole(user.role)}/order/step/duration/${rentId || ''}`} />
                <Button
                    type="submit"
                    primary
                    text="application.goToOrder"
                    disabled={tenantData() || companyData()}
                />
            </ButtonsContainer>
        </form>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    formData: state.order.formData,
    selectedPaymentMethod: state.order.selectedPaymentMethodDetail,
    selectedPayment: state.order.selectedPayment,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            ...order,
            ...modal,
            ...notifications,
            ...user,
        },
        dispatch,
    );

export default connect(mapStateToProps, mapDispatchToProps)(StepSummary);
