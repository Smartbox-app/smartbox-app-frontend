export type TemplateSectionRow = {
  id: string;
  type: string;
  channel: 'email' | 'sms';
  forStock: boolean;
  stockNames: string;
};

export type TemplateChannelGroup<Row extends TemplateSectionRow> = {
  generic: Row;
  stocks: Row[];
};

export type TemplateSection<Row extends TemplateSectionRow> = {
  label: string;
  email: TemplateChannelGroup<Row>[];
  sms: TemplateChannelGroup<Row>[];
};
