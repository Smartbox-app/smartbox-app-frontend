import type { UseQueryResult } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import type { AddonRes, CalculatedPriceRes } from 'smartbox-types';
import { setMaxRentPeriod, setMinRentPeriod } from 'src/actions/order';
import type { RentPeriodConfigRes } from 'src/queries/useRentPeriodConfigQuery/useRentPeriodConfigQuery';

export const useBridgeCalculatedPriceToRedux = (
  query: Pick<UseQueryResult<CalculatedPriceRes | null>, 'data' | 'isFetching'>,
) => {
  const dispatch = useDispatch();

  // isFetching only — disabled queries stay isPending in RQ v5
  useEffect(() => {
    dispatch({
      type: 'LOADING_PRICE',
      payload: query.isFetching,
    });
  }, [dispatch, query.isFetching]);

  useEffect(() => {
    if (query.data) {
      dispatch({ type: 'CALCULATE_RENT_PRICE_SUCCESS', payload: query.data });
    }
  }, [dispatch, query.data]);
};

export const useBridgeAddonsToRedux = (
  query: Pick<UseQueryResult<AddonRes[]>, 'data' | 'isFetching'>,
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'LOADING_ADDONS',
      payload: query.isFetching,
    });
  }, [dispatch, query.isFetching]);

  useEffect(() => {
    if (query.data) {
      dispatch({ type: 'FETCH_ADDONS_SUCCESS', payload: query.data });
    }
  }, [dispatch, query.data]);
};

export const useBridgeRentPeriodConfigToRedux = (
  query: Pick<UseQueryResult<RentPeriodConfigRes>, 'data'>,
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!query.data) return;

    dispatch(setMinRentPeriod(query.data.min));
    dispatch(setMaxRentPeriod(query.data.max || 0));
  }, [dispatch, query.data]);
};
