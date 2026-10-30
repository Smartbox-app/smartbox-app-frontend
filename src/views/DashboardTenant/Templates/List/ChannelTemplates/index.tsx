import styled from 'styled-components';

import { templateLanguage, TemplateListRow } from 'smartbox-types';
import { Button } from 'src/components/Branded';
import { Alert } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

import { SingleTemplate } from '../SingleTemplate';
import { TemplateChannelGroup } from '../types';

const withLang = (path: string, lang: TemplateListRow['lang']) =>
  `${path}?lang=${templateLanguage(lang)}`;

const editTo = (basePath: string, row: TemplateListRow) =>
  row.forStock
    ? `${basePath}/manage/${row.channel}/${row.type}/stock/${row.id}`
    : withLang(`${basePath}/manage/${row.channel}/${row.type}`, row.lang);

const overrideTo = (basePath: string, row: TemplateListRow) =>
  withLang(`${basePath}/manage/${row.channel}/${row.type}/stock`, row.lang);

const Group = styled('div')(({ theme }) => ({
  marginTop: theme.spacing * 6,
}));

const StockListHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing * 2,
}));

const channelLabel = (channel: 'email' | 'sms') =>
  channel === 'email' ? 'email' : 'sms';

type ChannelTemplatesProps = {
  basePath: string;
  channel: 'email' | 'sms';
  groups: TemplateChannelGroup<TemplateListRow>[];
  onDelete: (id: string, reset?: boolean) => void;
};

export const ChannelTemplates = ({
  basePath,
  channel,
  groups,
  onDelete,
}: ChannelTemplatesProps) => {
  if (groups.length === 0) return null;

  return (
    <Group>
      <Header variant="h5">
        {__(
          channel === 'email'
            ? 'application.templatesEmail'
            : 'application.templatesSms',
        )}
      </Header>
      {groups.map((group) => (
        <div key={group.generic.id}>
          <ul>
            <SingleTemplate
              type={channelLabel(channel)}
              title={__('application.templateScopeAll')}
              info={__(
                group.generic.isDefault
                  ? 'application.defaultTemplateUsed'
                  : 'application.templateSet',
              )}
              isSet={!group.generic.isDefault}
              even
            >
              <Button
                secondary
                to={editTo(basePath, group.generic)}
                text="application.editGenericTemplate"
              />
              {!group.generic.isDefault && (
                <Button
                  danger
                  text="application.resetTemplate"
                  click={() => onDelete(group.generic.id, true)}
                />
              )}
            </SingleTemplate>
          </ul>
          {group.generic.canOverride && (
            <Section variant="bordered">
              <StockListHeader>
                {group.stocks.length === 0 ? (
                  <Alert
                    compact
                    type="notice"
                    text="application.noStockTemplates"
                  />
                ) : (
                  <Header variant="h4">
                    {__('application.templatesForStocks')}
                  </Header>
                )}
                <ButtonsContainer>
                  <Button
                    text="application.addStockTemplate"
                    to={overrideTo(basePath, group.generic)}
                  />
                </ButtonsContainer>
              </StockListHeader>
              {group.stocks.length > 0 && (
                <ul>
                  {group.stocks.map((stock, index) => (
                    <SingleTemplate
                      key={stock.id}
                      type={channelLabel(stock.channel)}
                      title={stock.stockNames}
                      info={__('application.templateSet')}
                      isSet
                      even={index % 2 === 0}
                    >
                      <Button
                        secondary
                        to={editTo(basePath, stock)}
                        text="application.edit"
                      />
                      <Button
                        danger
                        text="application.delete"
                        click={() => onDelete(stock.id)}
                      />
                    </SingleTemplate>
                  ))}
                </ul>
              )}
            </Section>
          )}
        </div>
      ))}
    </Group>
  );
};
