import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import ApiService from '../../../../../../../services/api-service';
import {
  AddonClientAdminRes,
  AddonPriceResolveType,
  AddonPricingType,
  SingleAddonPricing,
  SingleAddonVariant,
} from 'smartbox-types';
import styled from 'styled-components';
import {
  Alert,
  CheckBox,
  Input,
  InputSelect,
} from '../../../../../../../components/Common';
import {
  ButtonsContainer,
  FormContainer,
  Section,
  SimpleHeader,
} from '../../../../../../../components/Layout';
import { Button, Spinner } from '../../../../../../../components/Branded';
import { __ } from '../../../../../../../helpers/i18n';
import { successNotification } from '../../../../../../../actions/notifications';
import { v4 } from 'uuid';
import { Header } from 'src/components/ui';

const StyledSinglePricing = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const StyledVariantContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
`;

const StyledVariantData = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const Pricing = () => {
  const { addonId } = useParams<{ addonId: string }>();
  const dispatch = useDispatch();
  const [addon, setAddon] = useState<AddonClientAdminRes>();
  const [variants, setVariants] = useState<SingleAddonVariant[]>([]);
  const [priceResolveType, setAddonPriceResolveType] =
    useState<AddonPriceResolveType>(AddonPriceResolveType.Proportional);
  const [loading, setLoading] = useState<boolean>(true);

  const getCurrentAddon = async () => {
    await ApiService.callFetch(
      'GET',
      `addon/${addonId}`,
      (data: AddonClientAdminRes) => {
        setVariants(data.pricing);
        setAddonPriceResolveType(data.priceResolveType);
        setAddon(data);
      },
    );
    setLoading(false);
  };

  const addVariant = () => {
    setVariants((prevVariants) => [
      ...prevVariants,
      { name: '', default: false, pricing: [], id: v4() },
    ]);
  };

  const deleteVariant = (idToDelete: string) => {
    setVariants((prevVariants) =>
      prevVariants.filter((variant) => variant.id !== idToDelete),
    );
  };

  const updateVariantName = (variantId: string, name: string) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) => {
        if (variant.id === variantId)
          return {
            ...variant,
            name,
          };
        return variant;
      }),
    );
  };

  const setVariantAsDefault = (variantId: string, selected: boolean) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) => {
        if (variant.id === variantId)
          return {
            ...variant,
            default: selected,
          };
        if (selected) {
          return {
            ...variant,
            default: false,
          };
        }
        return variant;
      }),
    );
  };

  const addPricing = (variantId: string) => {
    const updatedVariants = variants.map((variant) => {
      if (variant.id === variantId) {
        return {
          ...variant,
          pricing: [
            ...variant.pricing,
            { type: AddonPricingType.Year, quantity: 1, price: 0, id: v4() },
          ],
        };
      }
      return {
        ...variant,
        pricing: [...variant.pricing],
      };
    });
    setVariants(updatedVariants);
  };

  const deletePricing = (variantId: string, idToDelete: string) => {
    const updatedVariants = variants.map((variant) => {
      if (variant.id === variantId) {
        return {
          ...variant,
          pricing: variant.pricing.filter(
            (pricing) => pricing.id !== idToDelete,
          ),
        };
      }
      return {
        ...variant,
        pricing: [...variant.pricing],
      };
    });
    setVariants(updatedVariants);
  };

  const updatePrice = (
    variantId: string,
    idToChange: string,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;

    const updatedVariants = variants.map((variant) => {
      if (variant.id === variantId) {
        return {
          ...variant,
          pricing: variant.pricing.map((pricing) => {
            if (pricing.id === idToChange)
              return {
                ...pricing,
                price: !value && value !== '0' ? null : Number(value),
              };
            return pricing;
          }),
        };
      }
      return {
        ...variant,
        pricing: [...variant.pricing],
      };
    });
    setVariants(updatedVariants);
  };

  const updateQuantity = (
    variantId: string,
    idToChange: string,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;

    const updatedVariants = variants.map((variant) => {
      if (variant.id === variantId) {
        return {
          ...variant,
          pricing: variant.pricing.map((pricing) => {
            if (pricing.id === idToChange)
              return {
                ...pricing,
                quantity: !value && value !== '0' ? null : Number(value),
              };
            return pricing;
          }),
        };
      }
      return {
        ...variant,
        pricing: [...variant.pricing],
      };
    });
    setVariants(updatedVariants);
  };

  const updateType = (
    variantId: string,
    idToChange: string,
    type: AddonPricingType,
  ) => {
    const updatedVariants = variants.map((variant) => {
      if (variant.id === variantId) {
        return {
          ...variant,
          pricing: variant.pricing.map((pricing) => {
            if (pricing.id === idToChange)
              return {
                ...pricing,
                type,
              };
            return pricing;
          }),
        };
      }
      return {
        ...variant,
        pricing: [...variant.pricing],
      };
    });
    setVariants(updatedVariants);
  };

  const savePricing = async () => {
    setLoading(true);
    await ApiService.callFetch(
      'PATCH',
      `addon/pricing/${addonId}`,
      () => {
        dispatch(successNotification('application.addonEdited'));
      },
      null,
      { variants, priceResolveType },
    );
    setLoading(false);
  };

  useEffect(() => {
    getCurrentAddon();
  }, []);

  return (
    <Section>
      <Header variant="h2">{`${__('application.pricing')} ${addon?.name}`}</Header>
      <FormContainer highlight>
        {loading && <Spinner overlay halfTransparent />}

        <Input
          type="radio"
          input={{
            name: 'priceResolveType',
            label: 'application.priceResolveType',
            value: priceResolveType,
            onChange: (e: ChangeEvent<HTMLInputElement>) =>
              setAddonPriceResolveType(e.target.value as AddonPriceResolveType),
          }}
          options={[
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
          ]}
        />
        <h4>{__('application.addonVariants')}</h4>
        {(!variants || variants.length === 0) && (
          <Alert type="notice" text="application.noAddonVariantsSet" />
        )}
        {variants.map((variant) => (
          <Section highlight key={variant.id}>
            <StyledVariantContainer>
              <StyledVariantData>
                <Input
                  type="text"
                  input={{
                    label: 'application.addonName',
                    name: `addon_name_${variant.id}`,
                    value: variant.name,
                    onChange: (value: ChangeEvent<HTMLInputElement>) =>
                      updateVariantName(variant.id, value.target.value),
                  }}
                />

                {variants.length > 1 && (
                  <Button
                    danger
                    text="application.delete"
                    click={() => deleteVariant(variant.id)}
                  />
                )}
              </StyledVariantData>
              <CheckBox
                label="application.addonVariantSelectByDefault"
                name={`addon_default_${variant.id}`}
                checked={variant.default}
                handleChange={(checked: boolean) =>
                  setVariantAsDefault(variant.id, checked)
                }
              />
            </StyledVariantContainer>

            <h5>
              {__('application.addonVariantPricing')} - {variant.name}
            </h5>
            
            {(!variant.pricing || variant.pricing.length === 0) && (
              <Alert
                type="notice"
                text="application.noAddonVariantPricingSet"
              />
            )}
            {variant.pricing && (
              <ul>
                {variant.pricing.map((singlePricing) => (
                  <li key={singlePricing.id}>
                    <StyledSinglePricing>
                      <InputSelect
                        label="application.periodType"
                        name={`type_${variant.id}_${singlePricing.id}`}
                        placeholder="application.select"
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
                            value: AddonPricingType.Quarter,
                            label: __('application.quarter'),
                          },
                          {
                            value: AddonPricingType.HalfYear,
                            label: __('application.half_year'),
                          },
                          {
                            value: AddonPricingType.Year,
                            label: __('application.year'),
                          },
                        ]}
                        onChange={(value: AddonPricingType) =>
                          updateType(variant.id, singlePricing.id, value)
                        }
                      />
                      <Input
                        type="number"
                        input={{
                          label: 'application.quantity',
                          name: `quantity_${variant.id}_${singlePricing.id}`,
                          value: singlePricing.quantity,
                          onChange: (value: ChangeEvent<HTMLInputElement>) =>
                            updateQuantity(variant.id, singlePricing.id, value),
                        }}
                      />
                      <Input
                        type="number"
                        input={{
                          label: 'application.netPrice',
                          name: `price_${variant.id}_${singlePricing.id}`,
                          value: singlePricing.price,
                          onChange: (value: ChangeEvent<HTMLInputElement>) =>
                            updatePrice(variant.id, singlePricing.id, value),
                        }}
                      />
                      {variant.pricing.length > 1 && (
                        <Button
                          danger
                          text="application.delete"
                          click={() =>
                            deletePricing(variant.id, singlePricing.id)
                          }
                        />
                      )}
                    </StyledSinglePricing>
                  </li>
                ))}
              </ul>
            )}
            <ButtonsContainer>
              <Button
                text="application.add"
                click={() => addPricing(variant.id)}
              />
            </ButtonsContainer>
          </Section>
        ))}
        <ButtonsContainer>
          <Button text="application.addAddonVariant" click={addVariant} />
        </ButtonsContainer>

        <hr />
        <ButtonsContainer>
          <Button text="application.save" primary click={savePricing} />
        </ButtonsContainer>
      </FormContainer>
    </Section>
  );
};

export { Pricing };
