import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMobileBuildId } from 'src/utils/mobile-build-id';

type AppVersionVariants = 'default' | 'secondary';

const StyledVersion = styled('div')<{ variant: AppVersionVariants }>(
  ({ theme, variant }) => ({
    fontSize: 'inherit',
    textAlign: 'center',
    color: variant === 'secondary' ? theme.colors.text.disable : 'inherit',
  }),
);

export type AppVersionProps = {
  variant?: AppVersionVariants;
};

export const AppVersion = ({ variant = 'default' }: AppVersionProps) => {
  const [appVersion, setAppVersion] = useState<string>();
  const mobileBuildId = getMobileBuildId();

  useEffect(() => {
    const setVersion = async () => {
      if (Capacitor.isNativePlatform()) {
        const { version } = await App.getInfo();
        setAppVersion(version);
        return;
      }

      setAppVersion(localStorage.getItem('v') || '-');
    };

    void setVersion();
  }, []);

  const parts = [appVersion, mobileBuildId].filter(Boolean);

  if (parts.length === 0) return null;

  return (
    <StyledVersion variant={variant} data-testid="app-version">
      {parts.join(' | ')}
    </StyledVersion>
  );
};
