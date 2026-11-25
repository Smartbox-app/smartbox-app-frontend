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

export function Textarea(props: Props) {
  const { onChange, currentValue, field, fieldHtmlId, onFocus, onBlur } = props;
  const { placeholder, readOnly } = field;
  const { maxLength } = field.options;

  return (
    <textarea
      value={currentValue}
      readOnly={readOnly}
      placeholder={placeholder}
      id={fieldHtmlId}
      onChange={eventTargetValueExtractor(onChange)}
      onFocus={onFocus}
      onBlur={onBlur}
      maxLength={maxLength}
    />
  );
}
