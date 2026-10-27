import { useMemo } from 'react';

import { templateLanguage } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';
import { useTemplateListQuery } from 'src/queries';
import {
  TemplateSection,
  TemplateSectionRow,
} from './types';

const groupKey = (row: TemplateSectionRow) =>
  `${row.type}:${row.channel}:${templateLanguage(row.lang)}`;

const groupTemplates = <Row extends TemplateSectionRow>(
  rows: Row[],
): TemplateSection<Row>[] => {
  const byLabel = new Map<string, TemplateSection<Row>>();
  const seen = new Set<string>();

  const push = (generic: Row, stocks: Row[]) => {
    const label = __(`templates.${generic.type}`);
    const section = byLabel.get(label) ?? {
      label,
      email: [],
      sms: [],
    };
    section[generic.channel].push({ generic, stocks });
    byLabel.set(label, section);
  };

  const stocksFor = (generic: TemplateSectionRow) =>
    rows.filter(
      (row) => row.forStock && groupKey(row) === groupKey(generic),
    );

  rows
    .filter((row) => !row.forStock)
    .forEach((generic) => {
      seen.add(groupKey(generic));
      push(generic, stocksFor(generic));
    });

  rows
    .filter((row) => row.forStock)
    .forEach((stock) => {
      if (seen.has(groupKey(stock))) return;
      const lang = templateLanguage(stock.lang);
      seen.add(groupKey(stock));
      push(
        {
          ...stock,
          id: `default:${stock.type}:${lang}`,
          lang,
          forStock: false,
          stockNames: '',
          isDefault: true,
          content: undefined,
        },
        stocksFor({ ...stock, lang }),
      );
    });

  const sections: TemplateSection<Row>[] = [];
  byLabel.forEach((section) => sections.push(section));

  return sections.sort((left, right) =>
    left.label.localeCompare(right.label, 'pl'),
  );
};

export const useTemplateSections = (tenantId?: string) => {
  const { data, isPending } = useTemplateListQuery(tenantId);
  const sections = useMemo(() => groupTemplates(data ?? []), [data]);

  return { sections, isPending };
};
