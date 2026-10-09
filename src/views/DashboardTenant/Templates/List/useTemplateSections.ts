import { useMemo } from 'react';
import { __ } from 'src/helpers/i18n';
import { useTemplateListQuery } from 'src/queries';
import {
  TemplateSection,
  TemplateSectionRow,
} from './types';

const groupTemplates = <Row extends TemplateSectionRow>(
  rows: Row[],
): TemplateSection<Row>[] => {
  const byLabel = new Map<string, TemplateSection<Row>>();

  rows
    .filter((row) => !row.forStock)
    .forEach((generic) => {
      const label = __(`templates.${generic.type}`);
      const section = byLabel.get(label) ?? {
        label,
        email: [],
        sms: [],
      };
      section[generic.channel].push({
        generic,
        stocks: rows.filter(
          (row) => row.type === generic.type && row.forStock,
        ),
      });
      byLabel.set(label, section);
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
