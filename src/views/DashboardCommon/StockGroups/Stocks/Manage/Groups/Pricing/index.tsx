import { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';

import {
  BoxGroupAdminClientRes,
  PriceResolveType,
  PriceThreshold,
  PricingType,
  SinglePricing,
} from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Button, Spinner } from 'src/components/Branded';
import {
  Alert,
  Input,
  InputSelect,
} from 'src/components/Common';
import {
  ButtonsContainer,
  FormContainer,
} from 'src/components/Layout';
import { Header, Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import ApiService from 'src/services/api-service';

const StyledSinglePricing = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const StyledThresholds = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StyledPricingList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;



const numberOrNull = (value: string) =>
  !value && value !== '0' ? null : Number(value);

const Pricing = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const dispatch = useDispatch();
  const [group, setGroup] = useState<BoxGroupAdminClientRes>();
  const [pricing, setPricing] = useState<SinglePricing[]>([]);
  const [priceResolveType, setPriceResolveType] = useState<PriceResolveType>(
    PriceResolveType.Proportional,
  );
  const [loading, setLoading] = useState<boolean>(true);

  const getCurrentGroup = async () => {
    await ApiService.callFetch(
      'GET',
      `box-group-new/${groupId}`,
      (data: BoxGroupAdminClientRes) => {
        setPricing(
          (data.pricing ?? []).map((row) => ({
            ...row,
            thresholds: row.thresholds ?? [],
          })),
        );
        setPriceResolveType(data.priceResolveType);
        setGroup(data);
      },
    );
    setLoading(false);
  };

  const addPricing = () => {
    setPricing((prevPricing) => [
      ...prevPricing,
      { type: PricingType.Year, quantity: 1, price: 0, thresholds: [] },
    ]);
  };

  const deletePricing = (indexToDelete: number) => {
    setPricing((prevPricing) =>
      prevPricing.filter((pricing, index) => index !== indexToDelete),
    );
  };

  const updatePrice = (
    indexToChange: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    setPricing((prevPricing) =>
      prevPricing.map((pricing, index) => {
        if (indexToChange === index)
          return {
            ...pricing,
            price: !value && value !== '0' ? null : Number(value),
          };
        return pricing;
      }),
    );
  };

  const updateQuantity = (
    indexToChange: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target;
    setPricing((prevPricing) =>
      prevPricing.map((pricing, index) => {
        if (indexToChange === index)
          return {
            ...pricing,
            quantity: !value && value !== '0' ? null : Number(value),
          };
        return pricing;
      }),
    );
  };

  const updateType = (indexToChange: number, type: PricingType) => {
    setPricing((prevPricing) =>
      prevPricing.map((pricing, index) => {
        if (indexToChange === index)
          return {
            ...pricing,
            type,
          };
        return pricing;
      }),
    );
  };

  const updatePeriod = (
    periodIndex: number,
    update: (row: SinglePricing) => SinglePricing,
  ) => {
    setPricing((prevPricing) =>
      prevPricing.map((row, index) =>
        index === periodIndex ? update(row) : row,
      ),
    );
  };

  const addThreshold = (periodIndex: number) => {
    updatePeriod(periodIndex, (row) => ({
      ...row,
      thresholds: [...(row.thresholds ?? []), { boxesLeft: 1, price: 0 }],
    }));
  };

  const deleteThreshold = (periodIndex: number, thresholdIndex: number) => {
    updatePeriod(periodIndex, (row) => ({
      ...row,
      thresholds: (row.thresholds ?? []).filter(
        (_, index) => index !== thresholdIndex,
      ),
    }));
  };

  const updateThreshold = (
    periodIndex: number,
    thresholdIndex: number,
    field: keyof PriceThreshold,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    const next = numberOrNull(e.target.value);
    updatePeriod(periodIndex, (row) => ({
      ...row,
      thresholds: (row.thresholds ?? []).map((threshold, index) =>
        index === thresholdIndex ? { ...threshold, [field]: next } : threshold,
      ),
    }));
  };

  const savePricing = async () => {
    setLoading(true);
    await ApiService.callFetch(
      'PATCH',
      `box-group-new/pricing/${groupId}`,
      () => {
        dispatch(successNotification('application.boxGroupEdited'));
      },
      null,
      { pricing, priceResolveType },
    );
    setLoading(false);
  };

  useEffect(() => {
    getCurrentGroup();
  }, []);

  return (
    <Section>
      <Header variant="h2">{`${__('application.pricing')} ${group?.name}`}</Header>
      <FormContainer highlight>
        {loading && <Spinner overlay halfTransparent />}
        {(!pricing || pricing.length === 0) && (
          <Alert type="notice" text="application.noPricingSet" />
        )}

        <Input
          type="radio"
          input={{
            name: 'priceResolveType',
            label: 'application.priceResolveType',
            value: priceResolveType,
            onChange: (e: ChangeEvent<HTMLInputElement>) =>
              setPriceResolveType(e.target.value as PriceResolveType),
          }}
          options={[
            {
              label: 'application.priceResolveProportional',
              value: PriceResolveType.Proportional,
            },
            {
              label: 'application.priceResolveRoundToNearest',
              value: PriceResolveType.RoundToNearestPeriod,
            },
            {
              label: 'application.priceResolveByDay',
              value: PriceResolveType.RestByDay,
            },
          ]}
        />

        {pricing && (
          <StyledPricingList>
            {pricing.map((singlePricing, index: number) => (
              <li key={index}>
                <StyledSinglePricing>
                  <InputSelect
                    label="application.periodType"
                    name={`type_${index}`}
                    placeholder="application.select"
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
                        value: PricingType.Quarter,
                        label: __('application.quarter'),
                      },
                      {
                        value: PricingType.HalfYear,
                        label: __('application.half_year'),
                      },
                      {
                        value: PricingType.Year,
                        label: __('application.year'),
                      },
                    ]}
                    onChange={(value) => {
                      if (typeof value !== 'string') return;
                      updateType(index, value as PricingType);
                    }}
                  />
                  <Input
                    type="number"
                    input={{
                      label: 'application.quantity',
                      name: `quantity_${index}`,
                      value: singlePricing.quantity,
                      onChange: (value: ChangeEvent<HTMLInputElement>) =>
                        updateQuantity(index, value),
                    }}
                  />
                  <Input
                    type="number"
                    input={{
                      label: 'application.netPrice',
                      name: `price_${index}`,
                      value: singlePricing.price,
                      onChange: (value: ChangeEvent<HTMLInputElement>) =>
                        updatePrice(index, value),
                    }}
                  />
                  {pricing.length > 1 && (
                    <Button
                      danger
                      text="application.delete"
                      click={() => deletePricing(index)}
                    />
                  )}
                </StyledSinglePricing>

                <Section variant="bordered">
                  <div>
                    <Header variant="h3">
                      {__('application.priceThresholds')}
                    </Header>
                    <Typography>
                      {__('application.priceThresholdsDescription')}
                    </Typography>
                    <StyledThresholds>
                      {(singlePricing.thresholds ?? []).map(
                        (threshold, thresholdIndex) => (
                          <StyledSinglePricing key={thresholdIndex}>
                            <Input
                              type="number"
                              min={1}
                              step={1}
                              input={{
                                label: 'application.boxesLeft',
                                name: `boxesLeft_${index}_${thresholdIndex}`,
                                value: threshold.boxesLeft,
                                onChange: (
                                  value: ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateThreshold(
                                    index,
                                    thresholdIndex,
                                    'boxesLeft',
                                    value,
                                  ),
                              }}
                            />
                            <Input
                              type="number"
                              step={0.01}
                              input={{
                                label: 'application.netPrice',
                                name: `thresholdPrice_${index}_${thresholdIndex}`,
                                value: threshold.price,
                                onChange: (
                                  value: ChangeEvent<HTMLInputElement>,
                                ) =>
                                  updateThreshold(
                                    index,
                                    thresholdIndex,
                                    'price',
                                    value,
                                  ),
                              }}
                            />
                            <Button
                              danger
                              text="application.delete"
                              click={() =>
                                deleteThreshold(index, thresholdIndex)
                              }
                            />
                          </StyledSinglePricing>
                        ),
                      )}
                      <ButtonsContainer>
                        <Button
                          secondary
                          text="application.addPriceThreshold"
                          click={() => addThreshold(index)}
                        />
                      </ButtonsContainer>
                    </StyledThresholds>
                  </div>
                </Section>
              </li>
            ))}
          </StyledPricingList>
        )}
        <ButtonsContainer>
          <Button text="application.add" click={addPricing} />
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
