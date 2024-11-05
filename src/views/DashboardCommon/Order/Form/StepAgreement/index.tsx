import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, withRouter } from 'react-router-dom';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import { RentBoxReq, UserRole, UserRes, ExtendRentalReq, OrderAddons } from 'smartbox-types';
import { PaymentType } from 'smartbox-types';
import { Alert } from '../../../../../components/Common';
import { Button, Spinner } from '../../../../../components/Branded';
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
import styled from 'styled-components';

const AgreementWrapper = styled('div')({
    position: 'relative'
})

const SpinnerWrapper = styled('div')({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: -1
})

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
    const [agreementLoaded, setAgreementLoaded] = useState<boolean>(false);

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
                name: addon.name,
                slug: addon.slug,
                tax: addon.tax,
                acceptancesStatus: addon.acceptancesStatus,
                acceptances: addon.acceptances,
                price: addon.price ? addon.price.isGross ? addon.price.value : getCorrectPriceWithTax(addon.price.value, taxValue) : null,
                selectedVariant: addon.selectedVariant,
                selectedVariantName: addon.selectedVariantName,
            }
            // }
        })

        return parsedAddons;
    }

    const getSimplifiedAddons = (addons: OrderAddons) => {
        const simplified: { slug: string, variant: string | null, price: number | null }[] = [];
        Object.keys(addons).forEach(addonId => {
            const addon = addons[addonId];
            simplified.push({ slug: addon.slug, variant: addon.selectedVariantName, price: addon.price });
        })

        return simplified;
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
        if (!user || !order.endDate) return;
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

        if (formData.birthDate) {
            commonCollection['birthDate'] = formData.birthDate;
        }

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
            finishAt: order.endDate ? dateOnly(order.endDate) : null,
            cost: getCorrectPrice(order.calculatedPrice.value, order.calculatedPrice.isGross, tenant!.tax).toString(),
            // discountCode: order.discountCode,
            firstName: formData.firstName,
            lastName: formData.lastName,
            street: formData.street,
            city: formData.city,
            postCode: formData.postCode,
            isCompany: formData.isCompany ? 'true' : 'false',
            phone: formData.phone,
            birthDate: formData.birthDate ? dateOnly(formData.birthDate) : '',
            mailToSendInvoice: formData.mailToSendInvoice,
            companyName: formData.companyName || undefined,
            companyStreet: formData.companyStreet || undefined,
            companyCity: formData.companyCity || undefined,
            companyPostCode: formData.companyPostCode || undefined,
            nip: formData.nip || undefined,
            simplifiedAddons: getSimplifiedAddons(getAddonsWithCorrectPrice(order.orderAddons, tenant!.tax)),
            date: dateOnly(new Date()),
            startAt: dateOnly(order.startDate),
            email: user?.email || undefined,
            size: order.boxGroupName,
            stockName: order.stockName,
            stockAddress: order.stockAddress
        };
    }

    const onBack = () => {
        if (!user) return;
        history.push(`/${UserService.getSlugByRole(user.role)}/order/step/summary/${rentId || ''}`);
    };

    const checkFrame = () => {
        console.log('CHECKING FRAME', frameRef.current?.contentWindow, frameRef.current?.contentDocument)
        if (!frameRef.current) return false;

        const iframeDoc = frameRef.current.contentDocument || frameRef.current.contentWindow?.document;

        if (!iframeDoc?.body.children.length) {
            console.log('TRYING TO RELOAD');
            frameRef.current.src += '';
            frameRef.current.contentWindow?.location.reload();

            setTimeout(() => {
                checkFrame();
            }, 2000)
            return false;
        }
        else {
            setAgreementLoaded(true);
        }

        return true;
    }

    useEffect(() => {
        console.log('EFFETCT CALLED');
        if (!frameRef.current) return;

        if (!frameRef.current.contentDocument?.body.children.length) {
            checkFrame();
        }

    }, [frameRef])

    if (!tenant) return null;
    // const desktop = window.matchMedia('(min-width: 300px)').matches;
    const desktop = true;
    const { simplifiedAddons, ...values } = getValuesForAgreement();

    const params = new URLSearchParams()
    Object.keys(values).forEach(key => {
        if (values[key]) params.append(key, values[key])
    })

    params.append('addons', JSON.stringify(simplifiedAddons));

    console.log('PARAMS', params);

    const url = `${ApiService.url}tenant/agreement/${tenant.id}?${params}`;
    const encodedUrl = encodeURIComponent(url);

    console.log('URL', url, encodedUrl);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormHeader title="application.orderAgreement" />
            {desktop && (
                <AgreementWrapper>
                    {!agreementLoaded ? <SpinnerWrapper><Spinner overlay halfTransparent /></SpinnerWrapper> : null}
                    <iframe ref={frameRef} src={`https://docs.google.com/gview?embedded=true&url=${encodedUrl}`} height="300" style={{ height: "45vh", width: '100%' }}></iframe>
                    {/* <DocViewer language={undefined} documents={[{ uri: `${ApiService.url}tenant/agreement/${tenant.id}`, fileType: 'docx' }]} pluginRenderers={DocViewerRenderers} />
                 <object
                     className="rules-embed"
                     data={`${ApiService.url}tenant/agreement/${tenant.id}#toolbar=0&navpanes=0&scrollbar=0`}
                     type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                 /> */}
                </AgreementWrapper>
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
