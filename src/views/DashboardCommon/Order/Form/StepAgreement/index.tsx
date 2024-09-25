import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, withRouter } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import { RentBoxReq, UserRole, UserRes, ExtendRentalReq, OrderAddons } from 'smartbox-types';
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
import ApiService from '../../../../../services/api-service';
import { getCorrectPriceWithTax, getCorrectTaxPercentAmount } from '../../../../../utils/tax';
import { OrderAddon } from '../../../../../reducers/order-reducer';
import { dateOnly } from '../../../../../utils/format-date';

interface Props {
    formData: FormType;
    user: UserRes | null;
    isAgreementAccepted: boolean;
    isResignationMarked: boolean;
    stockId: string;
    paymentType: PaymentType;
    sentExtendRentRequest: (rentId: string, data: FormData, role: UserRole) => void;
    sentRentBoxRequest: (data: FormData, nextStep: string, role: UserRole) => void;
}

const StepSummary = ({
    formData,
    user,
    isResignationMarked,
    sentRentBoxRequest,
    paymentType,
    sentExtendRentRequest,
}: Props): any => {
    const order = useSelector((state: ApplicationState) => state.order);
    const tenant = useSelector((state: ApplicationState) => state.tenant);

    const frameRef = useRef<HTMLIFrameElement>(null);

    const { rentId, step } = useParams<{ step: string, rentId?: string }>();
    useEffect(() => {
        if (!user) return;
        if (!order.boxGroupId && !rentId) {
            history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
        }
    }, []);

    const getCorrectPrice = (price: number, isGross: boolean, tax: string) => {
        if (isGross) return price;
        const taxValue = getCorrectTaxPercentAmount(tax);

        return getCorrectPriceWithTax(price, taxValue);
    }

    const getAddonsWithCorrectPrice = (orderAddons: { [addonId: string]: OrderAddon }, tax: string): OrderAddons => {
        const parsedAddons: OrderAddons = {};
        const taxValue = getCorrectTaxPercentAmount(tax);

        Object.keys(orderAddons).forEach(addonId => {
            const addon = orderAddons[addonId];

            // if (addon.price?.value && addon.selectedVariant) {
                parsedAddons[addonId] = {
                    acceptancesStatus: addon.acceptancesStatus,
                    acceptances: addon.acceptances,
                    price: addon.price ? addon.price.isGross ? addon.price.value : getCorrectPriceWithTax(addon.price.value, taxValue) : null,
                    selectedVariant: addon.selectedVariant

                }
            // }
        })

        return parsedAddons;
    }

    const { handleSubmit } = useForm();

    const getFormDataFromCollection = (collection: RentBoxReq | ExtendRentalReq): FormData => {
        const rentFormData = new FormData();

        for (let key in collection) {
            const value = collection[key]
            if (key === 'startAt') rentFormData.append(key, value.toISOString())
            else if (key === 'finishAt') rentFormData.append(key, value.toISOString())
            else if (key === 'orderAddons') rentFormData.append(key, JSON.stringify(value))
            else rentFormData.append(key, value)
        }

        for (let addonId of Object.keys(order.orderAddons)) {
            const orderAddon = order.orderAddons[addonId];

            if (orderAddon && orderAddon.file) {
                rentFormData.append('addonFiles', orderAddon.file, `${addonId}--${orderAddon.file.name}`);
            }
        }

        return rentFormData;
    }

    const onSubmit = (data: any) => {
        if (!user) return;
        const commonCollection = {
            finishAt: order.endDate,
            cost: getCorrectPrice(order.calculatedPrice.value, order.calculatedPrice.isGross, tenant!.tax),
            discountCode: order.discountCode,
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
            orderAddons: getAddonsWithCorrectPrice(order.orderAddons, tenant!.tax)
        };

        const dataCollectionExtendRent: ExtendRentalReq = {
            ...commonCollection,
            isPaySavedCard: false,
            type: paymentType,
        };

        const dataCollectionRent: RentBoxReq = {
            ...commonCollection,
            startAt: order.startDate,
            stockId: order.stockId,
            boxGroupId: order.boxGroupId,
            type: paymentType,
        };



        if (rentId) {
            // rent extension
            const rentFormData = getFormDataFromCollection(dataCollectionExtendRent);

            sentExtendRentRequest(rentId, rentFormData, user.role);
        } else {
            // new Rent blik/creditcart

            const rentFormData = getFormDataFromCollection(dataCollectionRent);
            sentRentBoxRequest(rentFormData, 'payment', user.role);
        }
    };

    const getValuesForAgreement = () => {
        return {
            finishAt: dateOnly(order.endDate),
            cost: getCorrectPrice(order.calculatedPrice.value, order.calculatedPrice.isGross, tenant!.tax),
            discountCode: order.discountCode,
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
            orderAddons: getAddonsWithCorrectPrice(order.orderAddons, tenant!.tax),
            date: dateOnly(new Date()),
            startAt: dateOnly(order.startDate),
            email: user?.email || '',
        };
    }

    const onBack = () => {
        if (!user) return;
        history.push(`/${UserService.getSlugByRole(user.role)}/order/step/summary/${rentId || ''}`);
    };

    useEffect(() => {
        if (!frameRef.current) return;

        if (frameRef.current.title === '') frameRef.current.contentWindow?.location.reload();
    }, [frameRef])

    if (!tenant) return null;
    // const desktop = window.matchMedia('(min-width: 300px)').matches;
    const desktop = true;
    const { firstName, lastName, email, phone, startAt, date, finishAt, cost } = getValuesForAgreement();
    const url = `${ApiService.url}tenant/agreement/${tenant.id}?firstName=${firstName}&lastName=${lastName}&email=${email}&phone=${phone}&date=${date}&cost=${cost}&startAt=${startAt}&finishAt=${finishAt}&number=0`;
    const encodedUrl = encodeURIComponent(url);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormHeader title="application.orderAgreement" />
            {/* <AgreementWrapper /> */}
            {desktop && (
                <iframe ref={frameRef} src={`https://docs.google.com/gview?embedded=true&url=${encodedUrl}`} height="300" style={{ height: "45vh" }}></iframe>
                // <DocViewer language={undefined} documents={[{ uri: `${ApiService.url}tenant/agreement/${tenant.id}`, fileType: 'docx' }]} pluginRenderers={DocViewerRenderers} />
                // <object
                //     className="rules-embed"
                //     data={`${ApiService.url}tenant/agreement/${tenant.id}#toolbar=0&navpanes=0&scrollbar=0`}
                //     type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                // />
            )}
            <Button primary blank to={url} text='Kliknij aby otworzyć' />
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
    user: state.user.details,
    isResignationMarked: state.order.isResignationMarked,
    stockId: state.order.formData.stock,
    paymentType: state.order.selectedPayment,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            ...order,
        },
        dispatch,
    );

export default connect(mapStateToProps, mapDispatchToProps)(StepSummary);
