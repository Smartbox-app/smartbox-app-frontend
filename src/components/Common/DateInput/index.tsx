import React from 'react';
import Flatpickr from 'react-flatpickr';

import flatpickr from 'flatpickr'; // Check out other cool Themes: https://flatpickr.js.org/themes/
import { Polish } from 'flatpickr/dist/l10n/pl';

import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { TranslatableObject } from '../../../utils/errors-trans';
import { InputErrors } from '../InputErrors';
import { isBefore } from 'date-fns';
import { InputLabel } from 'src/components/ui/InputLabel';
import { ErrorText } from 'src/components/ui/ErrorText';
import { darken } from 'polished';
import { getColorForBackground } from 'src/utils/color';

import {
  getInputFieldStyles,
  InputSize,
  InputSizeProps,
  resolveInputSize,
} from '../input-sizes';
import { StyledFieldContainer } from '../input-styled';

flatpickr.localize(Polish);
flatpickr.defaultConfig.time_24hr = true;

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

  return (
    <StyledDateContainer $size={resolvedSize} $noMargin>
      <InputLabel labelFor={name} required={required}>{__(label ?? '')}</InputLabel>
      <Flatpickr
        onDayCreate={(dates, curentDateString, self, data) => {
          if (!highlightEnd || !highlightStart) return;
          const date = data.dateObj;
          if (!isBefore(date, highlightStart) && isBefore(date, highlightEnd)) {
            data.classList.add('highlighted');
          } else {
            data.classList.remove('highlighted');
          }
        }}
        name={name}
        ref={register && register({ name })}
        onChange={(data: Date[]) => {
          onChange?.(data);
        }}
        required={required}
        value={value}
        options={{
          allowInput,
          inline,
          enableTime: false,
          locale: 'pl',
          ...(allowInput ? { dateFormat: 'd.m.Y' } : {}),
          minDate,
          maxDate,
        }}
      />
      {error ? <ErrorText error={error} /> : null}
      {errors && <InputErrors size={resolvedSize} errors={errors} />}
    </StyledDateContainer>
  );
};

export default DateInput;
