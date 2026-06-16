import React from 'react';
import { FieldsMapper } from '../components/Common';
import {
  FieldAndEventFunction,
  FormFieldToRender,
} from 'itf_formbuilder_react';
import { TranslatableObject } from './errors-trans';

export const mapFieldsBig = (
  field: FormFieldToRender,
  errors: TranslatableObject[],
  fieldHtmlId: string,
  currentValue: string | number | boolean | object | undefined,
  onChange: (value: string | number | boolean | object | undefined) => void,
  onFocus: FieldAndEventFunction,
  onBlur: FieldAndEventFunction,
) => (
  <FieldsMapper
    fieldHtmlId={fieldHtmlId}
    field={field}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    currentValue={currentValue}
    errors={errors}
    size="large"
  />
);

export const mapFields = (
  field: FormFieldToRender,
  errors: TranslatableObject[],
  fieldHtmlId: string,
  currentValue: string | number | boolean | object | undefined,
  onChange: (value: string | number | boolean | object | undefined) => void,
  onFocus: FieldAndEventFunction,
  onBlur: FieldAndEventFunction,
) => (
  <FieldsMapper
    fieldHtmlId={fieldHtmlId}
    field={field}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    currentValue={currentValue}
    errors={errors}
    size="medium"
  />
);
