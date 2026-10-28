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

export function NumberInput(props: Props) {
  const { onChange, currentValue, field, fieldHtmlId, onFocus, onBlur } = props;
  const { placeholder, readOnly } = field;
  const { isFloat, step, min, max, type } = field.options;

  return (
    <input
      type={type || 'number'}
      readOnly={readOnly}
      placeholder={placeholder}
      value={Number.isNaN(currentValue) ? '' : currentValue}
      id={fieldHtmlId}
      onChange={eventTargetValueExtractor(onChange, 'value', (val) =>
        val === '' ? NaN : Number(val)
      )}
      min={min}
      max={max}
      step={step ? step : isFloat === true ? 0.1 : 1}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
