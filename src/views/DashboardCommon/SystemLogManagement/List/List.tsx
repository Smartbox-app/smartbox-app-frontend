import React, { ReactNode } from 'react';
import {
  systemLogAdminTableSchema,
  systemLogTableSchema,
  TableSchema,
} from 'smartbox-tables';

import { ApiTable } from '../../../../components/Common';
import { ButtonsContainer, Section } from '../../../../components/Layout';
import {
  HeaderWithActions,
  Button as UIButton,
  Typography,
} from 'src/components/ui';
import { __ } from '../../../../helpers/i18n';
import { useGetMyDetailsQuery } from 'src/queries';
import {
  UserRole,
  SystemLogAdminListItem,
  SystemLogClientListItem,
  SystemLogMeta,
} from 'smartbox-types';
import { handleFileOpen } from 'src/utils/handle-file-open';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

const parseMeta = (meta: unknown): SystemLogMeta | null => {
  if (!meta) return null;
  if (typeof meta === 'object' && 'body' in meta) return meta as SystemLogMeta;
  if (typeof meta === 'string') {
    try {
      return JSON.parse(meta);
    } catch {
      return null;
    }
  }
  return null;
};

const formatMeta = (meta: unknown): ReactNode => {
  const parsedMeta = parseMeta(meta);
  if (!parsedMeta) return '-';

  if (typeof parsedMeta.body !== 'object') return '-';

  const metaBody = parsedMeta.body as Record<string, string>;

  return Object.keys(metaBody as Record<string, string>).map((key) => (
    <div key={key}>
      <strong>{key}:</strong> {metaBody[key]}
    </div>
  ));
};

export const List = () => {
  const { data: user } = useGetMyDetailsQuery();

  if (!user) return null;

  const baseScheme: TableSchema =
    user.role === UserRole.admin
      ? systemLogAdminTableSchema
      : systemLogTableSchema;

  const scheme: TableSchema = new InteractiveTableSchema(baseScheme)
    .removeFields('meta')
    .addFieldAfter('action', {
      name: 'Szczegóły',
      field: 'meta',
      type: FieldType.Custom,
      sortable: false,
      searchable: false,
      customRender: (
        _value,
        _field,
        row: SystemLogAdminListItem | SystemLogClientListItem,
      ) => {
        const rawMeta = row.meta;

        if (!rawMeta) return '-';
        return <pre>{formatMeta(rawMeta)}</pre>;
      },
    });

  const handleSystemLogsCsvDownload = () => {
    handleFileOpen('system-log/export/csv');
  };

  return (
    <Section>
      <HeaderWithActions
        actions={
          <ButtonsContainer>
            <UIButton
              variant="secondary"
              text={__('application.downloadSystemLogsCsv')}
              onClick={handleSystemLogsCsvDownload}
            />
          </ButtonsContainer>
        }
      >
        {__('application.systemLogs')}
      </HeaderWithActions>
      <Typography>{__('application.systemLogsRetentionInfo')}</Typography>
      <ApiTable scheme={scheme} apiEndpointSubUrl={`system-log/list`} />
    </Section>
  );
};
