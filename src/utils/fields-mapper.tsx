import React from 'react';
import { FieldsMapper } from '../components/Common';

export const mapFieldsBig = (
  field,
  errors,
  fieldHtmlId,
  currentValue,
  onChange,
  onFocus,
  onBlur,
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
  field,
  errors,
  fieldHtmlId,
  currentValue,
  onChange,
  onFocus,
  onBlur,
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
