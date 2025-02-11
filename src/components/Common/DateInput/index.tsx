import React from "react";
import Flatpickr from "react-flatpickr";
import { useForm } from "react-hook-form";
import flatpickr from "flatpickr"; // Check out other cool Themes: https://flatpickr.js.org/themes/
import { Polish } from "flatpickr/dist/l10n/pl";

import "./DateInput.scss";
import { __ } from "../../../helpers/i18n";
import styled from "styled-components";
import { InputLabel } from "../InputLabel";
import { TranslatableObject } from "../../../utils/errors-trans";
import { InputErrors } from "../InputErrors";
import { isAfter, isBefore } from "date-fns";

flatpickr.localize(Polish);
flatpickr.defaultConfig.time_24hr = true;

interface Props {
  name: string;
  value?: Date[] | Date;
  label?: string;
  onChange?: any;
  minDate?: Date;
  maxDate?: Date;
  register?: any;
  inline?: boolean;
  big?: boolean;
  errors?: TranslatableObject[];
  noPadding?: boolean;
  required?: boolean;
  highlightStart?: Date | null;
  highlightEnd?: Date | null;
}

const StyledContainer = styled.div<{ noPadding?: boolean }>`
  padding: ${(props) => (props.noPadding ? 0 : "10px")};
  &.big {
    .flatpickr-input {
      border: 2px solid ${(props) => props.theme.colors.primary};
    }
  }
  &.compact {
    .flatpickr-input {
      border-bottom: 2px solid ${(props) => props.theme.colors.primary};
    }
  }

  .flatpickr-calendar {
    margin: 10px auto;
  }

  span.flatpickr-day {
    border: none;
  }
`;

const DateInput = ({
  name,
  value,
  noPadding,
  onChange,
  label,
  errors,
  minDate,
  maxDate,
  big,
  register,
  highlightEnd,
  highlightStart,
  required = true,
  inline = true,
}: Props) => {
  return (
    <StyledContainer
      noPadding={noPadding}
      className={`data-picker-wrapper ${big ? "big" : "compact"}`}
    >
      <InputLabel label={label} name={name} />
      <Flatpickr
        onDayCreate={(dates, curentDateString, self, data) => {
          if (!highlightEnd || !highlightStart) return;
          const date = data.dateObj;
          if (isAfter(date, highlightStart) && isBefore(date, highlightEnd)) {
            data.classList.add("highlighted");
          } else {
            data.classList.remove("highlighted");
          }
        }}
        name={name}
        ref={register && register({ name })}
        onChange={(data: any) => {
          onChange(data);
        }}
        required={required}
        value={value}
        options={{
          allowInput: false,
          inline,
          enableTime: false,
          locale: "pl",
          minDate,
          maxDate,
        }}
      />
      {errors && <InputErrors errors={errors} />}
    </StyledContainer>
  );
};

export default DateInput;
