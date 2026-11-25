import * as React from "react";
import { FormFieldToRender, ThirdPartyComponents } from "../ItfFormBuilder";

interface Props {
  onChange: (currentValue: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  currentValue: any;
  fieldHtmlId: string;
  field: FormFieldToRender;
  thirdPartyComponents: ThirdPartyComponents;
}

function checkAndGetFlatpickr(thirdPartyComponents: ThirdPartyComponents) {
  if (thirdPartyComponents && thirdPartyComponents.flatpickr)
    return thirdPartyComponents.flatpickr;

  console.error(`###########
Using DateTimeInput with ItfFormBuilder requires flatpickr! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.flatpickr.

# The simplest is by using with Webpack/bundler:
    
yarn add flatpickr
or
npm i -S flatpickr

# Then:

import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/airbnb.css';  // Check out other cool Themes: https://flatpickr.js.org/themes/
import {Polish} from "flatpickr/dist/l10n/pl";
flatpickr.localize(Polish);
flatpickr.defaultConfig.time_24hr = true;

# Then pass it like this:

<ItfFormBuilder/ItfApiForm
    {/* ... */}
    thirdPartyComponents={{flatpickr}}
/>


#`);

  throw new Error(
    "Using DateTimeInput with ItfFormBuilder requires flatpickr! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.flatpickr."
  );
}

export class DateTimeInput extends React.Component<Props, {}> {
  private flatpickr: any;

  constructor(props: Props) {
    super(props);

    this.flatpickr = checkAndGetFlatpickr(props.thirdPartyComponents);
  }

  private getMode = () => {
    const { field } = this.props;
    const { multiple } = field.options;
    if (multiple) return "multiple";
    return "single";
  };

  componentDidMount() {
    const { onChange, currentValue, field, fieldHtmlId } = this.props;
    const { min, max, includeHours, multiple } = field.options;

    const mode = this.getMode();

    this.flatpickr("#" + fieldHtmlId, {
      mode,
      minDate: min,
      maxDate: max,
      defaultDate: currentValue,
      enableTime: includeHours,
      onChange: (selectedDates, dateStr, instance) => {
        if (mode === "multiple") {
          onChange(selectedDates);
        } else onChange(selectedDates[0]);
      }
    });
  }

  render() {
    const {
      onChange,
      currentValue,
      field,
      fieldHtmlId,
      onFocus,
      onBlur
    } = this.props;
    const { placeholder } = field;
    const { min, max, includeHours } = field.options;

    return (
      <input
        type="datetime-local"
        defaultValue={new Date(currentValue).toLocaleString()}
        placeholder={placeholder}
        readOnly
        id={fieldHtmlId}
        onFocus={onFocus}
        onBlur={onBlur}
        min={min ? new Date(min).toISOString() : undefined}
        max={max ? new Date(max).toISOString() : undefined}
      />
    );
  }
}
