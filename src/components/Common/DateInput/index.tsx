import { isBefore } from 'date-fns';
import { darken } from 'polished';
import React, { useCallback, useMemo } from 'react';
import Flatpickr from 'react-flatpickr';
import styled from 'styled-components';

import {
  getInputFieldStyles,
  InputSize,
  InputSizeProps,
  resolveInputSize,
} from 'src/components/Common/input-sizes';
import { StyledFieldContainer } from 'src/components/Common/input-styled';
import { InputErrors } from 'src/components/Common/InputErrors';
import { ErrorText } from 'src/components/ui/ErrorText';
import { InputLabel } from 'src/components/ui/InputLabel';
import { __ } from 'src/helpers/i18n';
import {
  applyFlatpickrLocale,
  flatpickrLocale,
} from 'src/i18n/flatpickr-locale';
import { getColorForBackground } from 'src/utils/color';
import { TranslatableObject } from 'src/utils/errors-trans';

applyFlatpickrLocale();

interface Props extends InputSizeProps {
  name: string;
  value?: Date[] | Date;
  label?: string;
  onChange?: (dates: Date[]) => void;
  minDate?: Date;
  maxDate?: Date;
  register?: (field: { name: string }) => React.Ref<Flatpickr> | undefined;
  inline?: boolean;
  errors?: TranslatableObject[];
  error?: string;
  noPadding?: boolean;
  required?: boolean;
  highlightStart?: Date | null;
  highlightEnd?: Date | null;
  allowInput?: boolean;
}

const StyledDateContainer = styled(StyledFieldContainer)<{ $size: InputSize }>(
  ({ theme, $size }) => ({
  display: 'flex',
  gap: theme.spacing * 2,
  flexDirection: 'column',
  width: 'auto',

  '.flatpickr-calendar': {
    width: 'unset',
    borderRadius: theme.radius.innerSurface,
    padding: theme.spacing * 4,
    paddingTop: theme.spacing,
    boxShadow: theme.shadows.primary,
  },

  '.dayContainer': {
    gap: '5px !important',
  },

  '.flatpickr-input': getInputFieldStyles(theme, $size),
  '.flatpickr-day': {
    '&.today': {
      borderColor: theme.colors.primary,
    },

    '&.highlighted': {
      backgroundColor: theme.colors.border.secondary,
      color: getColorForBackground('#ccc'),
    },

    '&.selected': {
      backgroundColor: theme.colors.primary,
      color: getColorForBackground(theme.colors.primary),
      borderColor: darken(0.05, theme.colors.primary),
    },
  },
  '.flatpickr-current-month': {
    padding: `0 ${theme.spacing * 2}px`,
    width: '100%',
    fontSize: '1rem',
    left: 0,
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 700,
    '.numInputWrapper': {
      display: 'flex',
    },
  },
  '.flatpickr-next-month, .flatpickr-prev-month': {
    padding: theme.spacing * 2,
    display: 'flex',
    alignItems: 'center',
    height: 42,
  },
  }),
);

const dateTime = (value?: Date | null) =>
  value instanceof Date && !Number.isNaN(value.getTime())
    ? value.getTime()
    : undefined;

const DateInput = ({
  name,
  value,
  onChange,
  label,
  error,
  errors,
  minDate,
  maxDate,
  register,
  highlightEnd,
  highlightStart,
  required = true,
  inline = true,
  size,
  big,
  compact,
  allowInput = false,
}: Props) => {
  const resolvedSize = resolveInputSize({ size, big, compact });
  const minTime = dateTime(minDate);
  const maxTime = dateTime(maxDate);
  const valueTime = Array.isArray(value)
    ? value.map((entry) => dateTime(entry)).join(',')
    : dateTime(value as Date | undefined);

  // Stable options/value: react-flatpickr calls flatpickr.set on every options
  // identity change; new Date() from parents on each Redux price re-render was
  // resetting the visible month so users could not pick a different day.
  const options = useMemo(
    () => ({
      allowInput,
      inline,
      enableTime: false,
      locale: flatpickrLocale(),
      ...(allowInput ? { dateFormat: 'd.m.Y' as const } : {}),
      ...(minTime != null ? { minDate: new Date(minTime) } : {}),
      ...(maxTime != null ? { maxDate: new Date(maxTime) } : {}),
    }),
    [allowInput, inline, minTime, maxTime],
  );

  const stableValue = useMemo(() => {
    if (valueTime == null || valueTime === '') return undefined;
    if (typeof valueTime === 'string' && valueTime.includes(',')) {
      return valueTime
        .split(',')
        .filter(Boolean)
        .map((entry) => new Date(Number(entry)));
    }
    return new Date(Number(valueTime));
  }, [valueTime]);

  const handleDayCreate = useCallback(
    (_dates: Date[], _curentDateString: string, _self: unknown, data: { dateObj: Date; classList: DOMTokenList }) => {
      if (!highlightEnd || !highlightStart) return;
      const date = data.dateObj;
      if (!isBefore(date, highlightStart) && isBefore(date, highlightEnd)) {
        data.classList.add('highlighted');
      } else {
        data.classList.remove('highlighted');
      }
    },
    [highlightEnd, highlightStart],
  );

  return (
    <StyledDateContainer $size={resolvedSize} $noMargin>
      <InputLabel labelFor={name} required={required}>{__(label ?? '')}</InputLabel>
      <Flatpickr
        onDayCreate={handleDayCreate}
        name={name}
        ref={register && register({ name })}
        onChange={(data: Date[]) => {
          onChange?.(data);
        }}
        required={required}
        value={stableValue}
        options={options}
      />
      {error ? <ErrorText error={error} /> : null}
      {errors && <InputErrors size={resolvedSize} errors={errors} />}
    </StyledDateContainer>
  );
};

export default DateInput;
