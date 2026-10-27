import styled from 'styled-components';

import { templateLanguage, TemplateListRow } from 'smartbox-types';
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

const langCode = (lang: TemplateListRow['lang']) =>
  templateLanguage(lang).toUpperCase();

export const ChannelStatus = ({ channel, groups }: ChannelStatusProps) => {
  const customGroups = groups.filter((group) => !group.generic.isDefault);
  const stockNames = stockNamesFor(groups);
  const canOverride = groups.some((group) => group.generic.canOverride);
  const customLabel =
    groups.length > 1 && customGroups.length > 0
      ? `${__('application.templateSet')} (${customGroups.map((group) => langCode(group.generic.lang)).join(', ')})`
      : __(
          customGroups.length
            ? 'application.templateSet'
            : 'application.defaultTemplateUsed',
        );

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
      {customLabel}
      {stockNames.length > 0 && ` · ${stockNames.join(', ')}`}
      {stockNames.length === 0 &&
        canOverride &&
        ` · ${__('application.noStockTemplates')}`}
    </ChannelLine>
  );
};
