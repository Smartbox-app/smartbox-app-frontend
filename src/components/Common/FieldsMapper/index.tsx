import {
  FieldAndEventFunction,
  FormFieldToRender,
} from 'itf_formbuilder_react';
import React, { useCallback } from 'react';

import { CheckBox, DateInput, Input, InputPhone, InputSelect } from 'src/components/Common';
import { AcceptancesField } from 'src/components/Common/AcceptancesField';
import FileInput from 'src/components/Common/FileInput';
import { InputSize } from 'src/components/Common/input-sizes';
import { Link } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { useI18n } from 'src/i18n';
import ApiService from 'src/services/api-service';
import { SelectOption } from 'src/types/select';
import {
  TranslatableObject,
  translateErrors,
} from 'src/utils/errors-trans';
import { localizedCountryName } from 'src/utils/country-locale';
import { toDate } from 'src/utils/format-date';
import { formOnTranslateString } from 'src/utils/trans-form';

const translateSelectOptionLabel = (
  name: string,
  value: string | number | boolean,
): string => {
  if (typeof value === 'string') {
    const country = localizedCountryName(value);
    if (country) return country;
  }
  return formOnTranslateString(name);
};

interface Props {
  fieldHtmlId: string;
  field: FormFieldToRender;
  currentValue: unknown;
  errors: TranslatableObject[];
  onChange(value: unknown): void;
  onFocus: FieldAndEventFunction;
  onBlur: FieldAndEventFunction;
  size?: InputSize;
  /** @deprecated Use `size="large"` */
  big?: boolean;
}

const parseInputNumber = (value: unknown) => {
  return typeof value === 'undefined' || (!value && value !== 0)
    ? value
    : Number(value);
};

const FieldsMapper = ({
  field,
  fieldHtmlId,
  currentValue,
  errors,
  size,
  big,
  onFocus,
  onBlur,
  onChange,
}: Props) => {
  const { t } = useI18n();
  const fieldSize = size ?? (big ? 'large' : 'medium');
  const getProperType = useCallback((field: FormFieldToRender) => {
    if (field.type === 'variablePlaceholder') return field.id;
    if (!field.options.type) return field.type;

    switch (field.options.type) {
      case 'phone':
        return 'phone';
    }

    return field.type;
  }, []);

  const { tenant } = useTenant();

  const getCustomCheckboxLabel = useCallback((field: FormFieldToRender) => {
    if (field.options?.type === 'checkboxRules' && tenant)
      return (
        <small>
          {t('application.readTheProvisions')}{' '}
          <Link target="_blank" href="/rules" rel="noreferrer">
            <u>{t('application.statutes')}</u>
          </Link>{' '}
          {t('application.and')}{' '}
          <Link target="_blank" href="/privacy-policy" rel="noreferrer">
            <u>{t('application.privacyPolices')}</u>
          </Link>{' '}
          {t('application.acceptContent')}
        </small>
      );

    return __(formOnTranslateString(field.title));
  }, [t, tenant]);

  const getDateInputValue = (value: unknown) => {
    if (value instanceof Date || Array.isArray(value)) return value;
    if (typeof value === 'string' || typeof value === 'number')
      return toDate(value) ?? undefined;
    return undefined;
  };

  const type = getProperType(field);

  switch (type) {
    // Handline Addon acceptances
    case 'acceptances':
      return (
        <AcceptancesField
          value={Array.isArray(currentValue) ? currentValue : []}
          onChange={onChange}
        />
      );
    case 'phone':
      return (
        <InputPhone
          size={fieldSize}
          errors={translateErrors(errors)}
          label={formOnTranslateString(field.title)}
          name={fieldHtmlId}
          value={typeof currentValue === 'string' ? currentValue : undefined}
          onChange={onChange}
        />
      );
    case 'text':
      return (
        <Input
          size={fieldSize}
          key={fieldHtmlId}
          type={field.options.type}
          help={formOnTranslateString(field.descr)}
          input={{
            label: formOnTranslateString(field.title),
            name: fieldHtmlId,
            id: fieldHtmlId,
            placeholder: formOnTranslateString(field.placeholder),
            errors: translateErrors(errors),
            value: currentValue,
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => onChange(event.target.value),
            onFocus,
            onBlur,
          }}
        />
      );
    case 'number':
      return (
        <Input
          size={fieldSize}
          key={fieldHtmlId}
          type={field.type || field.options.type}
          help={formOnTranslateString(field.descr)}
          step={field.options.step}
          input={{
            label: formOnTranslateString(field.title),
            name: fieldHtmlId,
            id: fieldHtmlId,
            placeholder: formOnTranslateString(field.placeholder),
            errors: translateErrors(errors),
            value: currentValue,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              onChange(parseInputNumber(event.target.value)),
            onFocus,
            onBlur,
          }}
        />
      );
    case 'textarea':
      return (
        <Input
          size={fieldSize}
          key={fieldHtmlId}
          type="textarea"
          help={formOnTranslateString(field.descr)}
          input={{
            label: formOnTranslateString(field.title),
            name: fieldHtmlId,
            id: fieldHtmlId,
            placeholder: formOnTranslateString(field.placeholder),
            errors: translateErrors(errors),
            value: currentValue,
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => onChange(event.target.value),
            onFocus,
            onBlur,
          }}
        />
      );
    case 'checkbox':
      return (
        <CheckBox
          key={fieldHtmlId}
          name={field.id}
          checked={Boolean(currentValue)}
          handleChange={() => onChange(!currentValue)}
          errors={translateErrors(errors)}
          help={formOnTranslateString(field.descr)}
          label={getCustomCheckboxLabel(field)}
        />
      );
    case 'fileDragDrop':
      return (
        <FileInput
          accept={field.options.accept}
          hasImage={field.options.previewUrl}
          label={formOnTranslateString(field.title)}
          input={{
            name: fieldHtmlId,
            id: fieldHtmlId,
            value: currentValue,
            onChange,
            onFocus,
            onBlur,
          }}
          meta={{
            touched: errors.length > 0,
            error: errors.length
              ? formOnTranslateString(
                  errors[0].messageWithPlaceholders,
                  errors[0].params,
                )
              : null,
          }}
        />
      );
    case 'staticSelect':
      return (
        <InputSelect
          label={formOnTranslateString(field.title)}
          name={fieldHtmlId}
          multiple={field.options && field.options.multipleChoices}
          help={formOnTranslateString(field.descr)}
          options={
            field.options.possibleValues &&
            field.options.possibleValues.map(
              (val: string | SelectOption, index: number) => {
                if (typeof val === 'object') {
                  return {
                    label: translateSelectOptionLabel(
                      String(val.name),
                      val.value,
                    ),
                    value: val.value,
                  };
                }
                return {
                  label: formOnTranslateString(val),
                  value: index,
                };
              },
            )
          }
          onChange={(val: string | number | null | (string | number)[]) => {
            if (field.options?.multipleChoices) {
              const values = Array.isArray(val) ? val : [];
              onChange(
                values.map((v) => ({
                  value: v,
                  label:
                    field.options.possibleValues?.find(
                      (opt: string | SelectOption) =>
                        typeof opt === 'object' ? opt.value === v : false,
                    )?.name ?? String(v),
                })),
              );
              return;
            }
            onChange(val);
          }}
          value={
            typeof currentValue === 'string' ||
            typeof currentValue === 'number' ||
            currentValue == null ||
            Array.isArray(currentValue)
              ? currentValue
              : undefined
          }
          placeholder={formOnTranslateString(field.placeholder)}
          errors={translateErrors(errors)}
        />
      );
    case 'dateTime':
      return (
        <DateInput
          label={formOnTranslateString(field.title)}
          required={field.required}
          value={getDateInputValue(currentValue)}
          name={fieldHtmlId}
          inline={false}
          size={fieldSize}
          errors={translateErrors(errors)}
          onChange={(val: Date[]) => {
            onChange(val[0]);
          }}
        />
      );
    case 'slides':
      return (
        <FileInput
          multiple
          accept={field.options.accept}
          hasImage={field.options.previewUrl}
          label="application.slides"
          input={{
            name: fieldHtmlId,
            id: fieldHtmlId,
            value: (Array.isArray(currentValue) ? currentValue : []).map(
              (slide) => `${ApiService.url}tenant/slide/${String(slide)}`,
            ),
            onChange,
            onFocus,
            onBlur,
          }}
          meta={{
            touched: errors.length > 0,
            error: errors.length
              ? formOnTranslateString(
                  errors[0].messageWithPlaceholders,
                  errors[0].params,
                )
              : null,
          }}
        />
      );
  }

  return null;
};

export { FieldsMapper };
