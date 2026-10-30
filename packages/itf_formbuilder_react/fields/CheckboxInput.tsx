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

export function CheckboxInput(props: Props) {
  const { onChange, currentValue, field, fieldHtmlId, onFocus, onBlur } = props;

  return (
    <input
      type="checkbox"
      readOnly={field.readOnly}
      checked={currentValue}
      id={fieldHtmlId}
      onChange={eventTargetValueExtractor(onChange, 'checked')}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
