import {
  AlarmHealthCheckStatus,
  GateHealthCheckStatus,
  LocationDiagnosticsStatus,
  LocationDiagnosticsWanState,
} from 'smartbox-types';
import { __ } from 'src/helpers/i18n';

export type DiagnosticsTone = 'success' | 'warning' | 'danger';

export const getHealthTone = (
  status: GateHealthCheckStatus | AlarmHealthCheckStatus,
): DiagnosticsTone => {
  switch (status) {
    case GateHealthCheckStatus.ConnectionLost:
      return 'danger';
    case GateHealthCheckStatus.Slow:
      return 'warning';
    case GateHealthCheckStatus.Ok:
      return 'success';
    default:
      return 'success';
  }
};

export const getHealthText = (
  status: GateHealthCheckStatus | AlarmHealthCheckStatus,
) => {
  switch (status) {
    case GateHealthCheckStatus.ConnectionLost:
      return __('application.lostConnection');
    case GateHealthCheckStatus.Slow:
      return __('application.slowConnection');
    case GateHealthCheckStatus.Ok:
      return __('application.okConnection');
    default:
      return '';
  }
};

export const getHealthIcon = (
  status: GateHealthCheckStatus | AlarmHealthCheckStatus,
) => {
  switch (status) {
    case GateHealthCheckStatus.ConnectionLost:
      return 'times-circle';
    case GateHealthCheckStatus.Slow:
      return 'exclamation-circle';
    case GateHealthCheckStatus.Ok:
      return 'check-circle';
    default:
      return '';
  }
};

/** Mirrors previous SCSS cascade: wan primary/unknown last → success. */
export const getInternetTone = (
  status: LocationDiagnosticsStatus,
  wan: LocationDiagnosticsWanState,
): DiagnosticsTone => {
  if (wan === 'primary' || wan === 'unknown') return 'success';
  if (status === 'down') return 'danger';
  if (wan === 'lte' || status === 'degraded') return 'warning';
  return 'success';
};

export const getWanText = (state: LocationDiagnosticsWanState) => {
  switch (state) {
    case 'primary':
      return __('application.diagnosticsWanPrimary');
    case 'lte':
      return __('application.diagnosticsWanLte');
    default:
      return __('application.diagnosticsWanUnknown');
  }
};

export const getDiagnosticsStatusText = (status: LocationDiagnosticsStatus) => {
  switch (status) {
    case 'ok':
      return __('application.diagnosticsStatusOk');
    case 'degraded':
      return __('application.diagnosticsStatusDegraded');
    case 'down':
      return __('application.diagnosticsStatusDown');
    default:
      return status;
  }
};

export const getAnsweringText = (answering: boolean | null) => {
  if (answering === true) return __('application.diagnosticsBusAnswering');
  if (answering === false) return __('application.diagnosticsBusSilent');
  return __('application.diagnosticsBusUnknown');
};
