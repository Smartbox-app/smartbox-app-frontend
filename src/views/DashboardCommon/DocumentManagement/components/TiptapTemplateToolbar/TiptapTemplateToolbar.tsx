import { Editor } from '@tiptap/react';
import React, { useMemo, useState } from 'react';

import {
  AGREEMENT_TEMPLATE_VARIABLES,
  buildAddonTemplateVariableOptions,
} from 'src/config/tiptap';
import { __ } from 'src/helpers/i18n';
import { useGetAddonTemplateVariablesQuery } from 'src/queries';
import { Toolbar, Button, TemplateSelect, TemplateInput } from '../styled';

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
    stockId: templateStockId,
  });

  const addonVariableOptions = useMemo(
    () =>
      buildAddonTemplateVariableOptions(addons, {
        variant: __('application.phrases.addonVariant'),
        price: __('application.phrases.addonPrice'),
      }),
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
          {__('application.phrases.insertVariable')}
        </option>
        {AGREEMENT_TEMPLATE_VARIABLES.map((variable) => (
          <option key={variable.name} value={variable.name}>
            {__(variable.label)}
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
            ? __('application.phrases.insertAddonVariable')
            : __('application.phrases.insertAddonChooseCustomer')}
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
          {__('application.phrases.insertCondition')}
        </option>
        {AGREEMENT_TEMPLATE_VARIABLES.map((variable) => (
          <option key={variable.name} value={variable.name}>
            {__(variable.label)} ({variable.name})
          </option>
        ))}
      </TemplateSelect>

      <TemplateInput
        type="text"
        value={customCondition}
        onChange={(event) => setCustomCondition(event.target.value)}
        placeholder={__('application.phrases.customConditionPlaceholder')}
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
        {__('application.phrases.conditionalBlock')}
      </Button>

      <TemplateInput
        type="text"
        value={customExpression}
        onChange={(event) => setCustomExpression(event.target.value)}
        placeholder={__('application.phrases.expressionPlaceholder')}
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
        {__('application.phrases.insertExpression')}
      </Button>
    </Toolbar>
  );
};
