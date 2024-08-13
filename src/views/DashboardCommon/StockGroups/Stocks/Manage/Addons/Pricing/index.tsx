import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import ApiService from '../../../../../../../services/api-service';
import { AddonClientAdminRes, AddonPriceResolveType, AddonPricingType, SingleAddonPricing, SingleAddonVariant } from 'smartbox-types';
import styled from 'styled-components';
import { Alert, Input, InputSelect } from '../../../../../../../components/Common';
import { ButtonsContainer, FormContainer, Section, SimpleHeader } from '../../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../../components/Branded';
import { __ } from '../../../../../../../helpers/i18n';
import { successNotification } from '../../../../../../../actions/notifications';

const StyledSinglePricing = styled.div`
display: flex;
gap: 5px;
align-items: center;`

const StyledVariantData = styled.div`
display: flex;
gap: 5px;
align-items: center;`


const Pricing = () => {
    const { addonId } = useParams<{ addonId: string }>();
    const dispatch = useDispatch();
    const [addon, setAddon] = useState<AddonClientAdminRes>();
    const [variants, setVariants] = useState<SingleAddonVariant[]>([]);
    const [priceResolveType, setAddonPriceResolveType] = useState<AddonPriceResolveType>(AddonPriceResolveType.Proportional);
    const [loading, setLoading] = useState<boolean>(true);

    const getCurrentAddon = async () => {
        await ApiService.callFetch('GET', `addon/${addonId}`, (data: AddonClientAdminRes) => {
            setVariants(data.pricing);
            setAddonPriceResolveType(data.priceResolveType);
            setAddon(data);
        });
        setLoading(false);
    }

    const addVariant = () => {
        setVariants(prevVariants => [...prevVariants, { name: '', pricing: [] }])
    }

    const deleteVariant = (indexToDelete: number) => {
        setVariants(prevVariants => prevVariants.filter((variant, index) => index !== indexToDelete))
    }

    const updateVariantName = (variantIndex: number, name: string) => {
        setVariants(prevVariants => prevVariants.map((variant, index) => {
            if (index === variantIndex) return ({
                ...variant,
                name
            })
            return variant;
        }))
    }

    const addPricing = (variantIndex: number) => {
        const updatedVariants = variants.map((variant, index) => {
            if (index === variantIndex) {
                return ({
                    ...variant,
                    pricing: [...variant.pricing, { type: AddonPricingType.Year, quantity: 1, price: 0 }]
                })
            }
            return ({
                ...variant,
                pricing: [...variant.pricing]
            })
        })
        setVariants(updatedVariants)
    }

    const deletePricing = (variantIndex: number, indexToDelete: number) => {
        const updatedVariants = variants.map((variant, index) => {
            if (index === variantIndex) {
                return ({
                    ...variant,
                    pricing: variant.pricing.filter((pricing, index) => index !== indexToDelete)
                })
            }
            return ({
                ...variant,
                pricing: [...variant.pricing]
            })
        })
        setVariants(updatedVariants)
    }

    const updatePrice = (variantIndex: number, indexToChange: number, e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const updatedVariants = variants.map((variant, index) => {
            if (index === variantIndex) {
                return ({
                    ...variant,
                    pricing: variant.pricing.map((pricing, index) => {
                        if (indexToChange === index) return {
                            ...pricing,
                            price: !value && value !== "0" ? null : Number(value)
                        }
                        return pricing;
                    })
                })
            }
            return ({
                ...variant,
                pricing: [...variant.pricing]
            })
        })
        setVariants(updatedVariants)
    }

    const updateQuantity = (variantIndex: number, indexToChange: number, e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        const updatedVariants = variants.map((variant, index) => {
            if (index === variantIndex) {
                return ({
                    ...variant,
                    pricing: variant.pricing.map((pricing, index) => {
                        if (indexToChange === index) return {
                            ...pricing,
                            quantity: !value && value !== "0" ? null : Number(value)
                        }
                        return pricing;
                    })
                })
            }
            return ({
                ...variant,
                pricing: [...variant.pricing]
            })
        })
        setVariants(updatedVariants)
    }

    const updateType = (variantIndex: number, indexToChange: number, type: AddonPricingType) => {
        const updatedVariants = variants.map((variant, index) => {
            if (index === variantIndex) {
                return ({
                    ...variant,
                    pricing: variant.pricing.map((pricing, index) => {
                        if (indexToChange === index) return {
                            ...pricing,
                            type
                        }
                        return pricing;
                    })
                })
            }
            return ({
                ...variant,
                pricing: [...variant.pricing]
            })
        })
        setVariants(updatedVariants)
    }

    const savePricing = async () => {
        setLoading(true);
        await ApiService.callFetch('PATCH', `addon/pricing/${addonId}`, () => {
            dispatch(successNotification('application.addonEdited'))
        }, null, { variants, priceResolveType });
        setLoading(false);
    }

    useEffect(() => {
        getCurrentAddon();
    }, [])

    return <>
        <SimpleHeader title={`${__('application.pricing')} ${addon?.name}`} />
        <FormContainer highlight>
            {loading && <Spinner overlay halfTransparent />}

            <Input type='radio' input={{
                name: 'priceResolveType',
                label: 'application.priceResolveType',
                value: priceResolveType,
                onChange: (e: ChangeEvent<HTMLInputElement>) => setAddonPriceResolveType(e.target.value as AddonPriceResolveType)

            }} options={[
                {
                    label: 'application.priceResolveProportional',
                    value: AddonPriceResolveType.Proportional,
                },
                {
                    label: 'application.priceResolveRoundToNearest',
                    value: AddonPriceResolveType.RoundToNearestPeriod,
                },
                {
                    label: 'application.priceResolveByDay',
                    value: AddonPriceResolveType.RestByDay,
                },
            ]} />
            <h4>{__('application.addonVariants')}</h4>
            {(!variants || variants.length === 0) && <Alert type='notice' text='application.noAddonVariantsSet' />}
            {variants.map((variant, variantIndex) => (<Section highlight key={variantIndex}>
                <StyledVariantData>
                    <Input type='text' input={{
                        label: 'application.addonName',
                        name: `addon_name_${variantIndex}`,
                        value: variant.name,
                        onChange: (value: ChangeEvent<HTMLInputElement>) => updateVariantName(variantIndex, value.target.value)
                    }} />
                    {variants.length > 1 && <Button danger text='application.delete' click={() => deleteVariant(variantIndex)} />}
                </StyledVariantData>
                <h5>{__('application.addonVariantPricing')} - {variant.name}</h5>

                {(!variant.pricing || variant.pricing.length === 0) && <Alert type='notice' text='application.noAddonVariantPricingSet' />}
                {variant.pricing && <ul>
                    {variant.pricing.map((singlePricing, index: number) => <li key={index}>
                        <StyledSinglePricing>
                            <InputSelect label='application.periodType'
                                name={`type_${variantIndex}_${index}`}
                                placeholder='application.select'
                                value={singlePricing.type}
                                options={[
                                    {
                                        value: AddonPricingType.Day,
                                        label: __('application.day'),
                                    },
                                    {
                                        value: AddonPricingType.Week,
                                        label: __('application.week'),
                                    },
                                    {
                                        value: AddonPricingType.Month,
                                        label: __('application.month'),
                                    },
                                    {
                                        value: AddonPricingType.Year,
                                        label: __('application.year'),
                                    },
                                ]}
                                onChange={(value: AddonPricingType) => updateType(variantIndex, index, value)}
                            />
                            <Input type='number' input={{
                                label: 'application.quantity',
                                name: `quantity_${variantIndex}_${index}`,
                                value: singlePricing.quantity,
                                onChange: (value: ChangeEvent<HTMLInputElement>) => updateQuantity(variantIndex, index, value)
                            }} />
                            <Input type='number' input={{
                                label: 'application.netPrice',
                                name: `price_${variantIndex}_${index}`,
                                value: singlePricing.price,
                                onChange: (value: ChangeEvent<HTMLInputElement>) => updatePrice(variantIndex, index, value)
                            }} />
                            {variant.pricing.length > 1 && <Button danger text='application.delete' click={() => deletePricing(variantIndex, index)} />}
                        </StyledSinglePricing>
                    </li>)}
                </ul>}
                <ButtonsContainer>
                    <Button text='application.add' click={() => addPricing(variantIndex)} />
                </ButtonsContainer>

            </Section>

            ))}
            <ButtonsContainer>
                <Button text='application.addAddonVariant' click={addVariant} />
            </ButtonsContainer>

            <hr />
            <ButtonsContainer>
                <Button text='application.save' primary click={savePricing} />
            </ButtonsContainer>
        </FormContainer >
    </>
}

export { Pricing }