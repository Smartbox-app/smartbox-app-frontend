import { useMemo } from 'react';

import { Language, templateLanguage } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';
import { useTemplateListQuery } from 'src/queries';

import {
  TemplateLanguageSection,
  TemplateSection,
  TemplateSectionRow,
} from './types';

const languageOrder = Object.values(Language);

const groupKey = (row: TemplateSectionRow) =>
  `${row.type}:${row.channel}:${templateLanguage(row.lang)}`;

const emptyLang = (lang: string): TemplateLanguageSection<TemplateSectionRow> => ({
  lang,
  email: [],
  sms: [],
});

const groupTemplates = <Row extends TemplateSectionRow>(
  rows: Row[],
): TemplateSection<Row>[] => {
  const byLabel = new Map<string, Map<string, TemplateLanguageSection<Row>>>();
  const seen = new Set<string>();

  const push = (generic: Row, stocks: Row[]) => {
    const label = __(`templates.${generic.type}`);
    const lang = templateLanguage(generic.lang);
    const languages = byLabel.get(label) ?? new Map();
    const bucket = languages.get(lang) ?? (emptyLang(lang) as TemplateLanguageSection<Row>);
    bucket[generic.channel].push({ generic, stocks });
    languages.set(lang, bucket);
    byLabel.set(label, languages);
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

  return [...byLabel.entries()]
    .map(([label, languages]) => ({
      label,
      languages: [...languages.values()].sort(
        (left, right) =>
          languageOrder.indexOf(left.lang as Language) -
          languageOrder.indexOf(right.lang as Language),
      ),
    }))
    .sort((left, right) => left.label.localeCompare(right.label, 'pl'));
};

export const useTemplateSections = (tenantId?: string) => {
  const { data, isPending } = useTemplateListQuery(tenantId);
  const sections = useMemo(() => groupTemplates(data ?? []), [data]);

  return { sections, isPending };
};
