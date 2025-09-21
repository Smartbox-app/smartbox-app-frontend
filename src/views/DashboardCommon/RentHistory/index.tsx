import { PeriodEntity, RentDescription, RentPaymentType } from 'smartbox-types';
import { dateOnly } from '../../../utils/format-date';
import { formatPrice } from '../../../utils/format-price';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { Button } from '../../../components/Branded';
import ApiService from '../../../services/api-service';
import { useMemo } from 'react';
import { isAfter, isBefore } from 'date-fns';

interface Props {
  description: RentDescription[];
  rentId: string;
  paymentType: RentPaymentType;
  periods: PeriodEntity[];
}

const StyledPeriodHeader = styled('h4')({
  color: '#333',
  fontWeight: 700,
  fontSize: '1rem',
  marginBottom: '10px',
});
const StyledSubHeader = styled('h4')({
  color: '#333',
  fontWeight: 700,
  margin: '10px 0',
  fontSize: '0.95rem',
});

const StyledSinglePeriod = styled('li')(({ theme }) => ({
  marginBottom: '10px',
  paddingBottom: '10px',
  borderBottom: `1px solid #fbfbfb`,
}));

const StyledSinglePaymentPeriod = styled('li')(({ theme }) => ({
  marginBottom: '10px',
  paddingLeft: 10,
  fontSize: '0.9rem',
  borderLeft: `5px solid ${theme.colors.primary}`,
}));

const StyledSingleAddon = styled('li')(({ theme }) => ({
  marginBottom: '10px',
  paddingLeft: 10,
  borderLeft: `5px solid ${theme.colors.secondary}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));

const StyledRentAgreementButton = styled('div')({
  display: 'flex',
});

const getPaymentTypeLabel = (type: RentPaymentType) => {
  switch (type) {
    case RentPaymentType.InAdvance:
      return 'application.paymentInAdvance';
    case RentPaymentType.Installments:
      return 'application.paymentInstallments';
  }
};

export const RentHistory = ({
  description,
  rentId,
  paymentType,
  periods,
}: Props) => {
  const sortedPeriods = useMemo(() => {
    const periodsCopy = [...periods];
    periodsCopy.sort((a, b) =>
      isAfter(new Date(b.startAt), new Date(a.startAt)) ? -1 : 1,
    );
    return periodsCopy;
  }, [periods]);

  return (
    <ul>
      {description.map((line, index) => (
        <StyledSinglePeriod key={index}>
          <StyledPeriodHeader>
            {dateOnly(line.startAt)} - {dateOnly(line.finishAt)}
          </StyledPeriodHeader>
          <p>
            {__('application.price')} - {formatPrice(Number(line.cost))}
          </p>
          <p>
            {__('application.paymentType')} -{' '}
            {__(getPaymentTypeLabel(line.paymentType || paymentType))}
          </p>
          {line.agreement ? (
            <StyledRentAgreementButton>
              <Button
                small
                primary
                blank
                text="application.seeRentAgreement"
                to={`${ApiService.url}rent/agreement/${rentId}/${index}`}
              />
            </StyledRentAgreementButton>
          ) : null}

          {line.addons && line.addons.length > 0 ? (
            <div>
              <StyledSubHeader>
                {__('application.selectedAddons')}
              </StyledSubHeader>
              <ul>
                {line.addons.map((addon) => (
                  <StyledSingleAddon key={addon.id}>
                    <div>
                      <strong>{addon.name}</strong>
                      {(typeof addon.price === 'number' && addon.selectedVariantName) ? (
                        <>
                          {' '}
                          - {addon.selectedVariantName} -{' '}
                          {formatPrice(Number(addon.price))}
                        </>
                      ) : null}
                    </div>

                    {addon.acceptance ? (
                      <p>
                        {addon.acceptance} -{' '}
                        <strong>{addon.accepted ? 'Tak' : 'Nie'}</strong>
                      </p>
                    ) : null}
                    {!!addon.acceptances && !!addon.acceptancesStatus
                      ? addon.acceptances.map((acceptance) => (
                          <p key={acceptance.id}>
                            {acceptance.text} -{' '}
                            <strong>
                              {addon.acceptancesStatus![acceptance.id].accepted
                                ? 'Tak'
                                : 'Nie'}
                            </strong>
                          </p>
                        ))
                      : null}
                    {addon.file ? (
                      <Button
                        small
                        blank
                        primary
                        to={`${ApiService.url}rent/file/${rentId}/${addon.file}`}
                        text="application.seeAttachedFile"
                      />
                    ) : null}
                  </StyledSingleAddon>
                ))}
              </ul>
            </div>
          ) : null}
          {line.paymentType === RentPaymentType.Installments ? (
            <>
              <StyledSubHeader>{__('application.periods')}</StyledSubHeader>
              <ul>
                {sortedPeriods
                  .filter(
                    (period) =>
                      !isBefore(
                        new Date(period.startAt),
                        new Date(line.startAt),
                      ) &&
                      !isAfter(
                        new Date(period.finishAt),
                        new Date(line.finishAt),
                      ),
                  )
                  .map((period) => {
                    console.log(
                      'PERIOD',
                      period,
                      !isBefore(
                        new Date(period.startAt),
                        new Date(line.startAt),
                      ),
                    );
                    return (
                      <StyledSinglePaymentPeriod key={period.id}>
                        {dateOnly(period.startAt)} - {dateOnly(period.finishAt)}{' '}
                        - <strong>{formatPrice(period.value)}</strong> -{' '}
                        {period.paid
                          ? __('application.periodPaid')
                          : __('application.periodUnpaid')}
                      </StyledSinglePaymentPeriod>
                    );
                  })}
              </ul>
            </>
          ) : null}
        </StyledSinglePeriod>
      ))}
    </ul>
  );
};
