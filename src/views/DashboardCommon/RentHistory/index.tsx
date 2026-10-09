import { PeriodEntity, RentDescription, RentPaymentType } from 'smartbox-types';
import { dateOnly } from '../../../utils/format-date';
import { formatPrice } from '../../../utils/format-price';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { RentAttachedFileButton } from 'src/components/Common/RentAttachedFileButton';
import { useMemo } from 'react';
import { RentAgreementButton } from '../SingleRentDetail/RentAgreementButton';
import {
  hasViewableAgreementPeriod,
  resolveRentAgreementForDescriptionLine,
} from 'src/utils/rent-agreement';
import { isAfter, isBefore } from 'date-fns';
import { Alert } from 'src/components/Common';

interface Props {
  description: RentDescription[];
  rentId: string;
  paymentType?: RentPaymentType;
  periods?: PeriodEntity[];
  decisionFinishAt?: Date;
  isOpenEnded?: boolean;
}

const StyledPeriodHeader = styled('h4')({
  color: '#333',
  fontWeight: 700,
  fontSize: '1rem',
  margin: 0,
});

const StyledSubHeader = styled('h4')({
  color: '#333',
  fontWeight: 700,
  margin: '10px 0',
  fontSize: '0.95rem',
});

const StyledSinglePeriod = styled('li')({
  marginBottom: '10px',
  paddingBottom: '10px',
  borderBottom: '1px solid #fbfbfb',
});

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
  padding: '16px 0',
});

const AttachedFileButtonContainer = styled('div')({
  padding: '8px 0',
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
  periods = [],
  decisionFinishAt,
  isOpenEnded,
}: Props) => {
  const sortedPeriods = useMemo(() => {
    const periodsCopy = [...periods];
    periodsCopy.sort((a, b) =>
      isAfter(new Date(b.startAt), new Date(a.startAt)) ? -1 : 1,
    );
    return periodsCopy;
  }, [periods]);

  return (
    <>
      {decisionFinishAt ? (
        <Alert type="notice">
          Wynajem zakończony przed czasem:{' '}
          <strong>{dateOnly(decisionFinishAt)}</strong>
        </Alert>
      ) : null}
      <ul>
        {description.map((line, index) => {
          const resolvedAgreement = resolveRentAgreementForDescriptionLine(
            line,
            periods,
          );

          return (
            <StyledSinglePeriod key={index}>
              <StyledPeriodHeader>
                {line.finishAt && !isOpenEnded
                  ? `${dateOnly(line.startAt)} - ${dateOnly(line.finishAt)}`
                  : dateOnly(line.startAt)}
              </StyledPeriodHeader>
              {hasViewableAgreementPeriod(line, periods) ? (
                <StyledRentAgreementButton>
                  <RentAgreementButton
                    rentId={rentId}
                    periodIndex={index}
                    documentId={resolvedAgreement.documentId}
                    agreement={resolvedAgreement.agreement}
                  />
                </StyledRentAgreementButton>
              ) : null}

              <p>
                {__('application.price')} - {formatPrice(Number(line.cost))}
              </p>
              {isOpenEnded ? null : (
                <p>
                  {__('application.paymentType')} -{' '}
                  {line.paymentType || paymentType
                    ? __(getPaymentTypeLabel((line.paymentType || paymentType)!))
                    : null}
                </p>
              )}

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
                          {typeof addon.price === 'number' &&
                          addon.selectedVariantName ? (
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
                        {addon.file ? (
                          <AttachedFileButtonContainer>
                            <RentAttachedFileButton
                              rentId={rentId}
                              fileName={addon.file}
                            />
                          </AttachedFileButtonContainer>
                        ) : null}
                      </StyledSingleAddon>
                    ))}
                  </ul>
                </div>
              ) : null}
              {isOpenEnded ||
              line.paymentType === RentPaymentType.Installments ? (
                <>
                  <StyledSubHeader>{__('application.periods')}</StyledSubHeader>
                  <ul>
                    {sortedPeriods
                      .filter((period) => {
                        if (isOpenEnded) return true;
                        const startsOnOrAfterLine = !isBefore(
                          new Date(period.startAt),
                          new Date(line.startAt),
                        );
                        if (!startsOnOrAfterLine) return false;
                        if (!line.finishAt) return true;
                        return !isAfter(
                          new Date(period.finishAt),
                          new Date(line.finishAt),
                        );
                      })
                      .map((period, index) => {
                        return (
                          <StyledSinglePaymentPeriod
                            key={`${String(period.startAt)}-${String(period.finishAt)}-${index}`}
                          >
                            {dateOnly(period.startAt)} -{' '}
                            {dateOnly(period.finishAt)} -{' '}
                            <strong>{formatPrice(period.value)}</strong> -{' '}
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
          );
        })}
      </ul>
    </>
  );
};
