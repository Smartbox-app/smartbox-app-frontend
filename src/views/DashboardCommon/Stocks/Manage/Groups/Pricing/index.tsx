import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import ApiService from '../../../../../../services/api-service';
import { BoxGroupAdminClientRes } from 'smartbox-types';
import { PricingType, SinglePricing } from '../../../../../../../../smartbox-back/types/box-group/pricing';
import styled from 'styled-components';
import { Alert, Input, InputSelect } from '../../../../../../components/Common';
import { ButtonsContainer, FormContainer, SimpleHeader } from '../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../components/Branded';
import { __ } from '../../../../../../helpers/i18n';
import { successNotification } from '../../../../../../actions/notifications';

const StyledSinglePricing = styled.div`
display: flex;
gap: 5px;
align-items: center;`

const Pricing = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const dispatch = useDispatch();
    const [group, setGroup] = useState<BoxGroupAdminClientRes>();
    const [pricing, setPricing] = useState<SinglePricing[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getCurrentGroup = async () => {
        await ApiService.callFetch('GET', `box-group-new/${groupId}`, (data: BoxGroupAdminClientRes) => {
            setPricing(data.pricing);
            setGroup(data);
        });
        setLoading(false);
    }

    const addPricing = () => {
        setPricing(prevPricing => [...prevPricing, { type: PricingType.Year, quantity: 1, price: 0 }])
    }

    const deletePricing = (indexToDelete: number) => {
        setPricing(prevPricing => prevPricing.filter((pricing, index) => index !== indexToDelete))
    }

    const updatePrice = (indexToChange: number, e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setPricing(prevPricing => prevPricing.map((pricing, index) => {
            if (indexToChange === index) return {
                ...pricing,
                price: Number(value)
            }
            return pricing;
        }))
    }

    const updateQuantity = (indexToChange: number, e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setPricing(prevPricing => prevPricing.map((pricing, index) => {
            if (indexToChange === index) return {
                ...pricing,
                quantity: Number(value)
            }
            return pricing;
        }))
    }

    const updateType = (indexToChange: number, type: PricingType) => {
        setPricing(prevPricing => prevPricing.map((pricing, index) => {
            if (indexToChange === index) return {
                ...pricing,
                type
            }
            return pricing;
        }))
    }

    const savePricing = async () => {
        setLoading(true);
        await ApiService.callFetch('PATCH', `box-group-new/pricing/${groupId}`, () => {
            dispatch(successNotification('application.boxGroupEdited'))
        }, null, pricing);
        setLoading(false);
    }

    useEffect(() => {
        getCurrentGroup();
    }, [])

    return <>
        <SimpleHeader title={`${__('application.pricing')} ${group?.name}`} />
        <FormContainer>
            {loading && <Spinner overlay halfTransparent />}
            {(!pricing || pricing.length === 0) && <Alert type='notice' text='application.noPricingSet' />}
            {pricing && <ul>
                {pricing.map((singlePricing, index: number) => <li key={index}>
                    <StyledSinglePricing>
                        <InputSelect label='application.periodType'
                            name={`type_${index}`}
                            placeholder='application.select'
                            value={singlePricing.type}
                            options={[
                                {
                                    value: PricingType.Day,
                                    label: __('application.day'),
                                },
                                {
                                    value: PricingType.Week,
                                    label: __('application.week'),
                                },
                                {
                                    value: PricingType.Month,
                                    label: __('application.month'),
                                },
                                {
                                    value: PricingType.Year,
                                    label: __('application.year'),
                                },
                            ]}
                            onChange={(value: PricingType) => updateType(index, value)}
                        />
                        <Input type='number' input={{
                            label: 'application.quantity',
                            name: `quantity_${index}`,
                            value: singlePricing.quantity,
                            onChange: (value: ChangeEvent<HTMLInputElement>) => updateQuantity(index, value)
                        }} />
                        <Input type='number' input={{
                            label: 'application.price',
                            name: `price_${index}`,
                            value: singlePricing.price,
                            onChange: (value: ChangeEvent<HTMLInputElement>) => updatePrice(index, value)
                        }} />
                        {pricing.length > 1 && <Button danger text='application.delete' click={() => deletePricing(index)} />}
                    </StyledSinglePricing>
                </li>)}
            </ul>}
            <ButtonsContainer>
                <Button text='application.add' primary click={addPricing} />
            </ButtonsContainer>
            <ButtonsContainer>
                <Button text='application.save' primary click={savePricing} />
            </ButtonsContainer>
        </FormContainer >
    </>
}

export { Pricing }