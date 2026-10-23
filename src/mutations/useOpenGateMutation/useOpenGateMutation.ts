import { useMutation } from '@tanstack/react-query';
import { Coordinate } from 'smartbox-types';
import ApiService from '../../services/api-service';

export type OpenGateMode = 'default' | 'force' | 'staff';

type OpenGateVariables = {
  gateId: string;
  mode: OpenGateMode;
  geo?: Coordinate;
};

const buildOpenGatePath = ({ gateId, mode, geo }: OpenGateVariables) => {
  switch (mode) {
    case 'staff':
      return `stock/open-gate-by-staff/${gateId}`;
    case 'force':
      if (!geo) throw new Error('geo is required for force gate opening');
      return `stock/open-gate-by-force/${gateId}/${geo.lat}/${geo.lon}`;
    default:
      if (!geo) throw new Error('geo is required for gate opening');
      return `stock/open-gate/${gateId}/${geo.lat}/${geo.lon}`;
  }
};

export const useOpenGateMutation = () =>
  useMutation({
    mutationKey: ['gate', 'open'],
    mutationFn: async (variables: OpenGateVariables) => {
      const path = buildOpenGatePath(variables);
      await ApiService.callFetch(
        'PATCH',
        path,
        undefined,
        undefined,
        variables.mode === 'default' ? variables.geo : undefined,
        true,
        true,
      );
    },
  });
