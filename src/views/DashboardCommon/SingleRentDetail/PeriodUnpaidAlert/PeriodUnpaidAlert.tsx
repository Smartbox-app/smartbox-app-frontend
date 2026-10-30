import { isBefore } from 'date-fns';
import { useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { MyRentDetails, RentAgreementType } from 'smartbox-types';
import { SectionHeader } from 'src/components/Layout';
import { Button, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { Wallet } from 'src/icons';
import { usePayForPeriodMutation } from 'src/mutations/usePayForPeriodMutation';
import { dateOnly } from 'src/utils/format-date';
import { formatPrice } from 'src/utils/format-price';
import { redirectToIpg } from 'src/utils/payment-form';

interface Props {
  rent: MyRentDetails;
}

const StyledMissingPeriodLists = styled('ul')({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

const StyledMissingPeriodPayment = styled('li')(({ theme }) => ({
  borderRadius: theme.radius.innerSurface,
  border: 'none',
  padding: theme.spacing * 4,
  background: theme.colors.surface.error.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexDirection: 'column',
  gap: theme.spacing * 4,
  '@media(min-width: 768px)': {
    flexDirection: 'row',
  },
}));

// @TODO HANDLE
export const PeriodUnpaidAlert = ({ rent }: Props) => {
  const { tenant } = useTenant();
  const tenantId = tenant?.id;
  const {
    mutate: payForPeriod,
    isPending,
    isSuccess,
    data,
  } = usePayForPeriodMutation();

  const unpaidPeriods = useMemo(() => {
    return (rent.periods ?? [])
      .filter(
        (period) =>
          (rent.agreementType === RentAgreementType.OpenEnded &&
            !period.paid) ||
          (isBefore(new Date(period.startAt), new Date()) && !period.paid),
      )
      .sort((a, b) =>
        isBefore(new Date(a.startAt), new Date(b.startAt)) ? 1 : -1,
      );
  }, [rent]);

  const pay = (periodId: string) => {
    payForPeriod({ periodId, rentId: rent.id });
  };

  useEffect(() => {
    if (!isSuccess || !data || !tenantId) return;

    redirectToIpg(tenantId, data.paymentId);
  }, [isSuccess, data, tenantId]);

  if (unpaidPeriods.length === 0) return null;

  return (
    <Section>
      <SectionHeader title="application.phrases.unpaidPeriods" />
      <StyledMissingPeriodLists>
        {unpaidPeriods.map((period, index) => {
          const periodId =
            'id' in period && typeof period.id === 'string'
              ? period.id
              : undefined;

          return (
            <StyledMissingPeriodPayment key={periodId ?? index}>
              <div>
                {dateOnly(period.startAt)} - {dateOnly(period.finishAt)} -{' '}
                <strong>{formatPrice(period.value)}</strong>
              </div>
              <Button
                variant="error"
                type="button"
                size="large"
                iconLeft={<Wallet />}
                disabled={isPending || !!data || !period.invoiceId || !periodId}
                onClick={() => {
                  if (periodId) pay(periodId);
                }}
                text={__('application.pay')}
              />
            </StyledMissingPeriodPayment>
          );
        })}
      </StyledMissingPeriodLists>
    </Section>
  );
};
