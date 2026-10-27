import styled, { css } from 'styled-components';

import {
  getInputErrorStyles,
  getInputFieldStyles,
  getInputHelpStyles,
  getTextareaFieldStyles,
  InputSize,
} from 'src/components/Common/input-sizes';

export const StyledFieldContainer = styled.div<{
  $noMargin?: boolean;
  $hidden?: boolean;
}>`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: ${({ $noMargin }) => ($noMargin ? 0 : '10px')};

  ${({ $hidden }) =>
    $hidden &&
    css`
      display: none;
    `}
`;

export const StyledFieldWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 2.5px;
`;

export const StyledTextInput = styled.input<{
  $size: InputSize;
  $error: boolean;
  $colorInput?: boolean;
}>(({ theme, $size, $error, $colorInput }) => ({
  ...getInputFieldStyles(theme, $size, { error: $error }),
  ...($colorInput ? { padding: 0 } : {}),
}));

export const StyledTextarea = styled.textarea<{
  $size: InputSize;
  $error: boolean;
}>(({ theme, $size, $error }) => getTextareaFieldStyles(theme, $size, { error: $error }));

export const StyledNativeSelect = styled.select<{
  $size: InputSize;
  $error: boolean;
}>(({ theme, $size, $error }) => ({
  ...getInputFieldStyles(theme, $size, { error: $error }),
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage: `url('/assets/icons/arrow-down.svg')`,
  backgroundPosition: '98% 50%',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '10px',
  cursor: 'pointer',
}));

export const StyledInputHelp = styled.p<{ $size: InputSize }>(
  ({ theme, $size }) => getInputHelpStyles(theme, $size),
);

export const StyledInputError = styled.p<{ $size: InputSize }>(
  ({ theme, $size }) => getInputErrorStyles(theme, $size),
);

export const StyledPhoneFieldContainer = styled(StyledFieldContainer)<{
  $error: boolean;
  $size: InputSize;
}>(({ theme, $size, $error }) => {
  const fieldStyles = getInputFieldStyles(theme, $size, { error: $error });

  return {
    '.PhoneInput': {
      ...fieldStyles,
      display: 'flex',
      alignItems: 'center',
    },
    '.PhoneInputCountry': {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      marginRight: theme.spacing * 2.5,
    },
    '.PhoneInputCountryIcon': {
      display: 'flex',
      alignItems: 'center',
    },
    '.PhoneInputCountrySelect': {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      zIndex: 1,
      border: 0,
      opacity: 0,
      cursor: 'pointer',
    },
    '.PhoneInputCountryIconImg': {
      width: 24,
    },
    '.PhoneInputCountrySelectArrow': {
      display: 'block',
      width: '0.45em',
      height: '0.45em',
      marginLeft: '0.5em',
      borderStyle: 'solid',
      borderTopWidth: 0,
      borderBottomWidth: 1,
      borderLeftWidth: 0,
      borderRightWidth: 1,
      transform: 'rotate(45deg)',
      opacity: 0.45,
    },
    '.PhoneInputInput': {
      background: 'transparent',
      border: 'none',
      flex: 1,
      font: 'inherit',
    },
  };
});
