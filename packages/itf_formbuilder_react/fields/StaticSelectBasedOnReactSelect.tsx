import * as React from 'react';
import { FormFieldToRender, ThirdPartyComponents } from '../ItfFormBuilder';

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
  thirdPartyComponents: ThirdPartyComponents;
}

function checkAndGetReactSelect(
  thirdPartyComponents: ThirdPartyComponents,
  creatable: boolean
): any {
  if (
    thirdPartyComponents &&
    thirdPartyComponents.ReactSelect &&
    thirdPartyComponents.ReactCreatableSelect
  )
    return creatable
      ? thirdPartyComponents.ReactCreatableSelect
      : thirdPartyComponents.ReactSelect;

  console.error(`###########
Using StaticSelect with options.useReactSelectComponent set to true with ItfFormBuilder requires React Select! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.ReactSelect and as thirdPartyComponents.ReactCreatableSelect.

# The simplest is by using with Webpack/bundler:
    
yarn add react-select
or
npm i -S react-select

# To include types:

yarn add @types/react-select --dev
or
npm i -D @types/react-select

# Then:

import ReactSelect from 'react-select'
import ReactCreatableSelect from 'react-select/creatable'

# Then pass it like this:

<ItfFormBuilder/ItfApiForm
    {/* ... */}
    thirdPartyComponents={{ReactSelect, ReactCreatableSelect}}
/>


#`);

  throw new Error(
    'Using StaticSelect with options.useReactSelectComponent set to true with ItfFormBuilder requires React Select! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.ReactSelect.'
  );
}

export function StaticSelectBasedOnReactSelect(props: Props) {
  const {
    onChange,
    currentValue,
    field,
    fieldHtmlId,
    onFocus,
    onBlur,
    transPlainStr,
  } = props;
  const {
    possibleValues,
    multipleChoices,
    creatable,
    translateValues,
    translateCreatedValue,
  } = field.options;

  const { readOnly } = field;

  const ReactSelect = checkAndGetReactSelect(
    props.thirdPartyComponents,
    creatable
  );

  let options: { value: string; label: string }[] = [];

  if (Array.isArray(possibleValues)) {
    if (possibleValues.length > 0) {
      options = possibleValues.map((val) => {
        if (typeof val === 'object') {
          return {
            value: val.value,
            label: translateValues ? transPlainStr(val.name) : val.name,
          };
        } else {
          return {
            value: val,
            label: translateValues ? transPlainStr(val) : val,
          };
        }
      });
    }
  } else {
    options = Object.keys(possibleValues).map((key) => ({
      value: key,
      label: translateValues
        ? transPlainStr(possibleValues[key])
        : possibleValues[key],
    }));
  }

  const handleChange = (vals: any) => {
    const realVals = multipleChoices
      ? vals === null
        ? []
        : vals.map((v) => v.value)
      : typeof vals !== 'undefined' && vals !== null && vals !== ''
      ? vals.value
      : null;
    onChange(realVals);
  };

  const oneRealValToOneReactSelectVal = (
    value: any
  ): { label: string; value: any } => {
    const found = Object.keys(possibleValues).find((v) => v === value);
    return {
      value,
      label: found
        ? translateValues
          ? transPlainStr(possibleValues[found])
          : possibleValues[found]
        : translateCreatedValue
        ? transPlainStr(value)
        : transPlainStr(value),
    };
  };

  const getValue = () => {
    if (
      currentValue === null ||
      (multipleChoices && (currentValue as string[]).length === 0)
    )
      return null;

    return multipleChoices
      ? (currentValue as string[]).map(oneRealValToOneReactSelectVal)
      : oneRealValToOneReactSelectVal(currentValue as string);
  };

  return (
    <ReactSelect
      options={options}
      onBlur={onBlur}
      onFocus={onFocus}
      onChange={handleChange}
      isDisabled={readOnly}
      noOptionsMessage={() => transPlainStr('Nothing found')}
      placeholder={field.placeholder || transPlainStr('Select...')}
      value={getValue()}
      isMulti={multipleChoices}
      isClearable={!field.required}
      id={fieldHtmlId}
    />
  );
}
