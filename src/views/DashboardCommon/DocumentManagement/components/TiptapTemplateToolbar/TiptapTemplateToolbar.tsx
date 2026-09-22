import React, { useMemo, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Toolbar, Button, TemplateSelect, TemplateInput } from '../styled';
import {
  AGREEMENT_TEMPLATE_VARIABLES,
  buildAddonTemplateVariableOptions,
} from 'src/config/tiptap';
import { useGetAddonTemplateVariablesQuery } from 'src/queries';

type Props = {
  editor: Editor | null;
  templateTenantId?: string;
  templateStockId?: string | null;
};

export const TiptapTemplateToolbar = ({
  editor,
  templateTenantId,
  templateStockId,
}: Props) => {
  const [customCondition, setCustomCondition] = useState('');
  const [customExpression, setCustomExpression] = useState('');

  const { data: addons = [] } = useGetAddonTemplateVariablesQuery({
    tenantId: templateTenantId,
    stockId: templateStockId,
  });

  const addonVariableOptions = useMemo(
    () => buildAddonTemplateVariableOptions(addons),
    [addons],
  );

  if (!editor) return null;

  const insertVariable = (name: string) => {
    if (!name) return;
    editor.chain().focus().insertTemplateVariable(name).run();
  };

  const insertConditional = (condition = '') => {
    editor.chain().focus().insertTemplateConditional(condition).run();
  };

  const insertExpression = (expression = '') => {
    editor.chain().focus().insertTemplateExpression(expression).run();
  };

  return (
    <Toolbar>
      <TemplateSelect
        defaultValue=""
        onChange={(event) => {
          insertVariable(event.target.value);
          event.target.value = '';
        }}
      >
        <option value="" disabled>
          Wstaw zmienną
        </option>
        {AGREEMENT_TEMPLATE_VARIABLES.map((variable) => (
          <option key={variable.name} value={variable.name}>
            {variable.label}
          </option>
        ))}
      </TemplateSelect>

      <TemplateSelect
        defaultValue=""
        disabled={!templateTenantId}
        onChange={(event) => {
          insertVariable(event.target.value);
          event.target.value = '';
        }}
      >
        <option value="" disabled>
          {templateTenantId
            ? 'Wstaw zmienną dodatku'
            : 'Wybierz klienta (dodatki)'}
        </option>
        {addonVariableOptions.map((variable) => (
          <option key={variable.name} value={variable.name}>
            {variable.label}
          </option>
        ))}
      </TemplateSelect>

      <TemplateSelect
        defaultValue=""
        onChange={(event) => {
          insertConditional(event.target.value);
          event.target.value = '';
        }}
      >
        <option value="" disabled>
          Wstaw warunek (zmienna)
        </option>
        {AGREEMENT_TEMPLATE_VARIABLES.map((variable) => (
          <option key={variable.name} value={variable.name}>
            {variable.label} ({variable.name})
          </option>
        ))}
      </TemplateSelect>

      <TemplateInput
        type="text"
        value={customCondition}
        onChange={(event) => setCustomCondition(event.target.value)}
        placeholder="Własny warunek, np. isCompany"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            insertConditional(customCondition.trim());
            setCustomCondition('');
          }
        }}
      />

      <Button
        type="button"
        onClick={() => {
          insertConditional(customCondition.trim());
          setCustomCondition('');
        }}
      >
        Blok warunkowy
      </Button>

      <TemplateInput
        type="text"
        value={customExpression}
        onChange={(event) => setCustomExpression(event.target.value)}
        placeholder="Wyrażenie, np. cost + insurance.price"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            insertExpression(customExpression.trim());
            setCustomExpression('');
          }
        }}
      />

      <Button
        type="button"
        onClick={() => {
          insertExpression(customExpression.trim());
          setCustomExpression('');
        }}
      >
        Wstaw wyrażenie
      </Button>
    </Toolbar>
  );
};
