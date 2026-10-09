import { CSSProperties } from 'react';
import { DefaultTheme } from 'styled-components';
import { OptionTypeBase, StylesConfig } from 'react-select';

export type InputSize = 'small' | 'medium' | 'large';

export const DEFAULT_INPUT_SIZE: InputSize = 'medium';

export type InputSizeProps = {
  size?: InputSize;
  /** @deprecated Use `size="large"` */
  big?: boolean;
  /** @deprecated Use `size="small"` */
  compact?: boolean;
};

export const resolveInputSize = ({
  size,
  big,
  compact,
}: InputSizeProps = {}): InputSize => {
  if (size) return size;
  if (big) return 'large';
  if (compact) return 'small';
  return DEFAULT_INPUT_SIZE;
};

export type InputFieldStyleState = {
  error?: boolean;
  disabled?: boolean;
  focused?: boolean;
};

export const getInputSizeMetrics = (size: InputSize) => SIZE_METRICS[size];

const SIZE_METRICS: Record<
  InputSize,
  {
    height: number;
    fontSize: number;
    lineHeight: string;
    paddingVertical: number;
    paddingHorizontal: number;
    borderRadius: (theme: DefaultTheme) => number;
  }
> = {
  small: {
    height: 36,
    fontSize: 13,
    lineHeight: '18px',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: (theme) => theme.radius.innerSurface * 0.25,
  },
  medium: {
    height: 48,
    fontSize: 14,
    lineHeight: '20px',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: (theme) => theme.radius.innerSurface * 1,
  },
  large: {
    height: 60,
    fontSize: 16,
    lineHeight: '24px',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: () => 30,
  },
};

const TEXTAREA_MIN_HEIGHT: Record<InputSize, number> = {
  small: 96,
  medium: 120,
  large: 140,
};

const MESSAGE_FONT_SIZE: Record<InputSize, number> = {
  small: 12,
  medium: 13,
  large: 14,
};

const getInputBorderColor = (
  theme: DefaultTheme,
  { error = false, focused = false }: InputFieldStyleState,
) => {
  if (error) return theme.colors.danger;
  if (focused) return theme.colors.primary;
  return theme.colors.border.primary;
};

const getInputTextStyle = (
  theme: DefaultTheme,
  size: InputSize,
): Pick<CSSProperties, 'color' | 'fontSize' | 'lineHeight' | 'fontWeight'> => {
  const metrics = SIZE_METRICS[size];
  return {
    color: theme.colors.text.primary,
    fontSize: metrics.fontSize,
    lineHeight: metrics.lineHeight,
    fontWeight: 400,
  };
};

/** Plain CSS properties shared by native inputs and react-select control. */
export const getInputFieldStyleProps = (
  theme: DefaultTheme,
  size: InputSize,
  { error = false, disabled = false, focused = false }: InputFieldStyleState = {},
): CSSProperties => {
  const metrics = SIZE_METRICS[size];

  return {
    width: '100%',
    boxSizing: 'border-box',
    fontWeight: 400,
    fontSize: metrics.fontSize,
    lineHeight: metrics.lineHeight,
    height: metrics.height,
    minHeight: metrics.height,
    padding: `${metrics.paddingVertical}px ${metrics.paddingHorizontal}px`,
    borderRadius: metrics.borderRadius(theme),
    color: theme.colors.text.primary,
    background: disabled
      ? theme.colors.border.disable
      : theme.colors.background.white,
    border: `1px solid ${getInputBorderColor(theme, { error, focused })}`,
    outline: 'none',
    boxShadow: 'none',
    cursor: disabled ? 'not-allowed' : undefined,
  };
};

export const getInputFieldStyles = (
  theme: DefaultTheme,
  size: InputSize,
  state: InputFieldStyleState = {},
) => ({
  ...getInputFieldStyleProps(theme, size, state),
  '&::placeholder': {
    color: theme.colors.text.tertiary,
  },
  '&:focus': {
    borderColor: theme.colors.primary,
    outline: 'none',
  },
  '&:read-only': {
    background: theme.colors.border.disable,
  },
});

export const getTextareaFieldStyles = (
  theme: DefaultTheme,
  size: InputSize,
  state: InputFieldStyleState = {},
) => ({
  ...getInputFieldStyles(theme, size, state),
  height: 'auto',
  minHeight: TEXTAREA_MIN_HEIGHT[size],
  resize: 'vertical' as const,
});

export const getInputHelpStyles = (theme: DefaultTheme, size: InputSize) => ({
  color: theme.colors.text.primary,
  fontWeight: 500,
  fontSize: MESSAGE_FONT_SIZE[size],
  margin: 0,
  ...(size === 'large' ? { marginLeft: theme.spacing * 7.5 } : {}),
});

export const getInputErrorStyles = (theme: DefaultTheme, size: InputSize) => ({
  color: theme.colors.danger,
  fontWeight: 500,
  fontSize: MESSAGE_FONT_SIZE[size],
  margin: 0,
  ...(size === 'large' ? { marginLeft: theme.spacing * 7.5 } : {}),
});

function optionBackground(
  theme: DefaultTheme,
  optionState: { isFocused: boolean; isSelected: boolean },
) {
  if (optionState.isSelected) return theme.colors.primary;
  if (optionState.isFocused) return theme.colors.border.secondary;
  return theme.colors.background.white;
}

export const getReactSelectStyles = (
  theme: DefaultTheme,
  size: InputSize,
  state: InputFieldStyleState = {},
): StylesConfig<OptionTypeBase, boolean> => {
  const metrics = SIZE_METRICS[size];
  const textStyle = getInputTextStyle(theme, size);
  const indicatorPadding = Math.max(metrics.paddingHorizontal - 8, 4);

  return {
    control: (
      base: CSSProperties,
      selectState: { isFocused: boolean; isDisabled: boolean },
    ) => {
      const field = getInputFieldStyleProps(theme, size, {
        error: state.error,
        disabled: selectState.isDisabled || state.disabled,
        focused: selectState.isFocused,
      });

      return {
        ...base,
        minHeight: field.minHeight,
        height: field.height,
        fontSize: field.fontSize,
        lineHeight: field.lineHeight,
        borderRadius: field.borderRadius,
        backgroundColor: field.background as string,
        borderColor: getInputBorderColor(theme, {
          error: state.error,
          focused: selectState.isFocused,
        }),
        borderStyle: 'solid',
        borderWidth: 1,
        color: field.color,
        boxShadow: 'none',
        outline: 'none',
        width: field.width,
        boxSizing: field.boxSizing,
        cursor: field.cursor,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        padding: 0,
        transition: 'border-color 0.15s ease',
      } as CSSProperties;
    },
    valueContainer: (base: CSSProperties) => ({
      ...base,
      ...textStyle,
      padding: `${metrics.paddingVertical}px 0 ${metrics.paddingVertical}px ${metrics.paddingHorizontal}px`,
      height: metrics.height,
      display: 'flex',
      alignItems: 'center',
    }),
    input: (base: CSSProperties) => ({
      ...base,
      ...textStyle,
      margin: 0,
      padding: 0,
    }),
    singleValue: (base: CSSProperties) => ({
      ...base,
      ...textStyle,
      margin: 0,
      maxWidth: '100%',
    }),
    placeholder: (base: CSSProperties) => ({
      ...base,
      ...textStyle,
      color: theme.colors.text.tertiary,
      margin: 0,
    }),
    multiValue: (base: CSSProperties) => ({
      ...base,
      backgroundColor: theme.colors.border.secondary,
      borderRadius: metrics.borderRadius(theme) / 2,
    }),
    multiValueLabel: (base: CSSProperties) => ({
      ...base,
      ...textStyle,
      fontSize: metrics.fontSize - 1,
      padding: '2px 6px',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: theme.colors.text.secondary,
      backgroundColor: 'transparent',
      ':hover': {
        backgroundColor: theme.colors.danger,
        color: theme.colors.background.white,
      },
    }),
    indicatorsContainer: (base: CSSProperties) => ({
      ...base,
      height: metrics.height,
      alignItems: 'center',
      alignSelf: 'stretch',
      padding: `${metrics.paddingVertical}px ${indicatorPadding}px ${metrics.paddingVertical}px 4px`,
    }),
    clearIndicator: (base: CSSProperties) => ({
      ...base,
      color: theme.colors.text.secondary,
      padding: 4,
      cursor: 'pointer',
      ':hover': {
        color: theme.colors.text.primary,
      },
    }),
    dropdownIndicator: (base: CSSProperties) => ({
      ...base,
      color: theme.colors.text.secondary,
      padding: 4,
      cursor: 'pointer',
      ':hover': {
        color: theme.colors.text.primary,
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menu: (base: CSSProperties) => ({
      ...base,
      borderRadius: metrics.borderRadius(theme),
      border: `1px solid ${theme.colors.border.primary}`,
      boxShadow: theme.shadows.primary,
      overflow: 'hidden',
      zIndex: 9999,
    }),
    menuList: (base: CSSProperties) => ({
      ...base,
      padding: 4,
      ...textStyle,
    }),
    option: (
      base: CSSProperties,
      optionState: { isFocused: boolean; isSelected: boolean },
    ) => ({
      ...base,
      ...textStyle,
      cursor: 'pointer',
      backgroundColor: optionBackground(theme, optionState),
      color: optionState.isSelected
        ? theme.colors.background.white
        : theme.colors.text.primary,
        borderRadius: theme.spacing * 2.5,
      ':active': {
        backgroundColor: theme.colors.primary,
        color: theme.colors.background.white,
      },
    }),
    menuPortal: (base: CSSProperties) => ({
      ...base,
      zIndex: 9999,
    }),
  };
};
