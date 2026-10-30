export type TemplateSectionRow = {
  id: string;
  type: string;
  channel: 'email' | 'sms';
  lang?: string;
  forStock: boolean;
  stockNames: string;
  isDefault?: boolean;
  canOverride?: boolean;
  content?: string;
};

export type TemplateChannelGroup<Row extends TemplateSectionRow> = {
  generic: Row;
  stocks: Row[];
};

export type TemplateLanguageSection<Row extends TemplateSectionRow> = {
  lang: string;
  email: TemplateChannelGroup<Row>[];
  sms: TemplateChannelGroup<Row>[];
};

export type TemplateSection<Row extends TemplateSectionRow> = {
  label: string;
  languages: TemplateLanguageSection<Row>[];
};
