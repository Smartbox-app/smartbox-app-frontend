import * as React from 'react';
import { __ } from '../../../helpers/i18n';
import './Alert.scss';
import styled, { DefaultTheme } from 'styled-components';

type AlertTypes = 'error' | 'notice' | 'warning' | 'success';

interface AlertProps {
  type: 'error' | 'notice' | 'warning' | 'success';
  text: string;
  simple?: boolean;
  notification?: boolean;
}

const getBackgroundByType = (type: AlertTypes, theme: DefaultTheme) => {
  if (type === 'error') return theme.colors.surface.error.secondary;
  if (type === 'notice') return theme.colors.surface.information.secondary;
  if (type === 'warning') return theme.colors.surface.attention.secondary;
  if (type === 'success') return theme.colors.surface.success.secondary;
};

const getColorByType = (type: AlertTypes, theme: DefaultTheme) => {
  if (type === 'error') return theme.colors.surface.error.primary;
  if (type === 'notice') return theme.colors.surface.information.primary;
  if (type === 'warning') return theme.colors.surface.attention.primary;
  if (type === 'success') return theme.colors.surface.success.primary;
};

const StyledAlert = styled('div')<{ type: AlertTypes }>(({ theme, type }) => ({
  borderRadius: theme.radius.innerSurface,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing * 2,
  background: getBackgroundByType(type, theme),
  color: theme.colors.text.primary,
  padding: theme.spacing * 4,
  fontSize: '1rem',
  width: '100%'
}));

const StyledIcon = styled('span')<{ type: AlertTypes }>(({ theme, type }) => ({
  color: getColorByType(type, theme),
}));

const getIcon = (type: AlertTypes) => {
  if (type === 'success') {
     
    return (
      <StyledIcon
        type={type}
        className="fa fa-check-circle notification-marker"
        aria-hidden="true"
      />
    );
  }
  return (
    <StyledIcon
      type={type}
      className="fa fa-exclamation-circle notification-marker"
      aria-hidden="true"
    />
  );
};

const Alert = ({ type, text }: AlertProps) => (
  <StyledAlert type={type}>
    {getIcon(type)}
    {__(text)}
  </StyledAlert>
);

export default Alert;
