import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

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

  const setVersion = async () => {
    if (Capacitor.isNativePlatform()) {
      const { version } = await App.getInfo();
      setAppVersion(version);
      return;
    }

    setAppVersion(localStorage.getItem('v') || '-');
  };

  useEffect(() => {
    setVersion();
  }, [])

  return <StyledVersion variant={variant}>{appVersion}</StyledVersion>;
};
