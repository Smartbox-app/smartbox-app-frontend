import * as React from 'react';
import { FormFieldToRender } from '../ItfFormBuilder';
import { eventTargetValueExtractor } from '../utils/eventTargetValueExtractor';
import { pseudoArrayToArray } from '../utils/pseudoArrayToArray';

interface Props {
  onChange: (currentValue: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  currentValue:
    | null
    | string
    | number
    | string[]
    | number[]
    | boolean
    | boolean[];
  fieldHtmlId: string;
  field: FormFieldToRender;
  transPlainStr: (s: string) => string;
}

export function StaticSelectBasedOnHtmlSelect(props: Props) {
  const {
    onChange,
    currentValue,
    field,
    fieldHtmlId,
    onFocus,
    onBlur,
    transPlainStr,
  } = props;
  const { possibleValues, multipleChoices, translateValues } = field.options;
  const { readOnly } = field;
  let options;
  options = Object.keys(possibleValues).map((key) => (
    <option value={key} key={key}>
      {translateValues
        ? transPlainStr(possibleValues[key])
        : possibleValues[key]}
    </option>
  ));

  const handleOnChange =
    multipleChoices === true
      ? (event) => {
          const values = pseudoArrayToArray(
            event.target.querySelectorAll('option')
          )
            .filter((option) => option.selected)
            .map((option) => option.value);

          onChange(values);
        }
      : eventTargetValueExtractor(onChange);

  return (
    <select
      multiple={multipleChoices}
      value={currentValue === null ? undefined : (currentValue as string[])}
      id={fieldHtmlId}
      onChange={handleOnChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={readOnly}
    >
      {currentValue === null && (
        <option value={null as any}>{transPlainStr('Select...')}</option>
      )}
      {options}
    </select>
  );
}
