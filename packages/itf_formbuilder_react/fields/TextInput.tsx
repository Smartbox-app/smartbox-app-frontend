import * as React from 'react';
import { FormFieldToRender } from '../ItfFormBuilder';
import { eventTargetValueExtractor } from '../utils/eventTargetValueExtractor';

interface Props {
  onChange: (currentValue: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  currentValue: any;
  fieldHtmlId: string;
  field: FormFieldToRender;
}

export function TextInput(props: Props) {
  const { onChange, currentValue, field, fieldHtmlId, onFocus, onBlur } = props;
  const { placeholder, readOnly } = field;
  const { maxLength, type, pattern } = field.options;

  return (
    <input
      type={type || 'text'}
      readOnly={readOnly}
      placeholder={placeholder}
      value={currentValue}
      id={fieldHtmlId}
      onChange={eventTargetValueExtractor(onChange)}
      onFocus={onFocus}
      onBlur={onBlur}
      maxLength={maxLength}
      pattern={pattern}
    />
  );
}
