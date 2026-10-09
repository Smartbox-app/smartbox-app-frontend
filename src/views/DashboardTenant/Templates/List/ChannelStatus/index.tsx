import styled from 'styled-components';
import { TemplateListRow } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';
import { TemplateChannelGroup } from '../types';

const ChannelLine = styled('p')(({ theme }) => ({
  margin: `${theme.spacing}px 0 0`,
  fontSize: '0.85rem',
  color: theme.colors.text.secondary,
}));

type ChannelStatusProps = {
  channel: 'email' | 'sms';
  groups: TemplateChannelGroup<TemplateListRow>[];
};

const stockNamesFor = (groups: TemplateChannelGroup<TemplateListRow>[]) => {
  const names: string[] = [];
  groups.forEach((group) => {
    group.stocks.forEach((stock) => {
      if (stock.stockNames && !names.includes(stock.stockNames)) {
        names.push(stock.stockNames);
      }
    });
  });
  return names;
};

export const ChannelStatus = ({ channel, groups }: ChannelStatusProps) => {
  const custom = groups.some((group) => !group.generic.isDefault);
  const stockNames = stockNamesFor(groups);
  const canOverride = groups.some((group) => group.generic.canOverride);

  return (
    <ChannelLine>
      <strong>
        {__(
          channel === 'email'
            ? 'application.templatesEmail'
            : 'application.templatesSms',
        )}
      </strong>
      {': '}
      {__(custom ? 'application.templateSet' : 'application.defaultTemplateUsed')}
      {stockNames.length > 0 && ` · ${stockNames.join(', ')}`}
      {stockNames.length === 0 &&
        canOverride &&
        ` · ${__('application.noStockTemplates')}`}
    </ChannelLine>
  );
};
