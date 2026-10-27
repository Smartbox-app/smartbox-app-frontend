import { useCallback } from 'react';

import { RentAgreementType } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';
import { dateOnly } from 'src/utils/format-date';
import {
  hasDateValue,
  isOpenEndedAgreement,
  isRentWithinFinishAt,
  resolveRentFinishAt,
} from 'src/utils/rent';

export const useRent = () => {
  const formatFinishAt = useCallback(
    (
      finishAt?: Date | string | null,
      agreementType?: RentAgreementType | null,
      slice?: number,
    ) => {
      if (!hasDateValue(finishAt)) {
        if (isOpenEndedAgreement(agreementType)) {
          return __('application.openEndedAgreement');
        }
        return __('application.lack');
      }
      return dateOnly(finishAt, slice);
    },
    [],
  );

  const getAgreementTypeLabel = useCallback(
    (agreementType?: RentAgreementType | null) => {
      if (isOpenEndedAgreement(agreementType)) {
        return __('application.openEndedAgreement');
      }
      return __('application.fixedTermAgreement');
    },
    [],
  );

  return {
    formatFinishAt,
    getAgreementTypeLabel,
    isOpenEndedAgreement,
    isRentWithinFinishAt,
    resolveRentFinishAt,
  };
};
