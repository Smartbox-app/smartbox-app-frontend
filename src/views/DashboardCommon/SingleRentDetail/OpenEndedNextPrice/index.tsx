import { OpenEndedNextPeriodPreview } from 'smartbox-types';
import { Alert } from 'src/components/Common';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { dateOnly } from 'src/utils/format-date';
import { formatPrice } from 'src/utils/format-price';
import styled from 'styled-components';

type OpenEndedNextPriceProps = {
  preview: OpenEndedNextPeriodPreview;
};

const StyledBreakdown = styled('details')(({ theme }) => ({
  marginTop: theme.spacing * 2,
}));

const StyledSummary = styled('summary')(({ theme }) => ({
  cursor: 'pointer',
  fontWeight: 700,
  color: theme.colors.text.primary,
}));

const StyledList = styled('ul')(({ theme }) => ({
  margin: `${theme.spacing * 2}px 0 0`,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing,
}));

const StyledItem = styled('li')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: theme.spacing * 2,
  fontSize: 14,
  color: theme.colors.text.secondary,
}));

export const OpenEndedNextPrice = ({ preview }: OpenEndedNextPriceProps) => {
  const alertType = preview.value > preview.currentValue ? 'warning' : 'notice';
  
  return (
    <>
      <Header variant="h2">{__('application.openEndedNextPeriodPrice')}</Header>
      {preview.priceChanged ? (
        <Alert type={alertType}>
          {__('application.openEndedNextPriceChanged', {
            current: formatPrice(preview.currentValue),
            next: formatPrice(preview.value),
          })}
        </Alert>
      ) : null}
      <StyledBreakdown>
        <StyledSummary>
          {formatPrice(preview.value)} ({dateOnly(preview.startAt)} -{' '}
          {dateOnly(preview.finishAt)})
        </StyledSummary>
        <StyledList>
          <StyledItem>
            <span>{__('application.paymentForRent')}</span>
            <strong>{formatPrice(preview.boxPrice)}</strong>
          </StyledItem>
          {preview.addons.map((addon) => (
            <StyledItem key={addon.id}>
              <span>{addon.name}</span>
              <strong>{formatPrice(addon.price)}</strong>
            </StyledItem>
          ))}
        </StyledList>
      </StyledBreakdown>
    </>
  );
};
