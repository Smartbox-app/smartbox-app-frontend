import { useMutation } from '@tanstack/react-query';
import { Coordinate } from 'smartbox-types';
import ApiService from '../../services/api-service';

export type OpenKsmGateMode = 'default' | 'force';

type OpenKsmGateVariables = {
  gateId: string;
  geo: Coordinate;
  mode: OpenKsmGateMode;
};

export const useOpenKsmGateMutation = () =>
  useMutation({
    mutationKey: ['ksm-gate', 'open'],
    mutationFn: async ({ gateId, geo, mode }: OpenKsmGateVariables) => {
      const path =
        mode === 'force'
          ? `v2/stock/ksm/open-gate-by-force/${gateId}/${geo.lat}/${geo.lon}`
          : `v2/stock/ksm/open-gate/${gateId}/${geo.lat}/${geo.lon}`;

      return ApiService.callFetch<{ id: string }>(
        'PATCH',
        path,
        undefined,
        undefined,
        undefined,
        true,
        true,
      );
    },
  });
