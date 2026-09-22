import React, { useMemo } from 'react';
import UserService from 'src/services/user-service';
import { useGetMyDetailsQuery } from 'src/queries';
import { SingleTab } from 'src/types/tab';
import { UserRole } from 'smartbox-types';
import {
  Adjustments,
  Alert,
  Home,
  HomeWifi,
  InfoCircle,
  List,
  Message,
  Size,
  Templates,
} from 'src/icons';

export const TENANT_SETTINGS_DEFAULT_SEGMENT = 'appearance';

export const useTenantSettingsTabs = (
  basePathOverride?: string,
): {
  basePath: string;
  tabs: SingleTab[];
} => {
  const { data: user } = useGetMyDetailsQuery();

  return useMemo(() => {
    const slug = UserService.getSlugByRole(user?.role as UserRole);
    const basePath = basePathOverride ?? `/${slug}/management/settings`;
    const isAdmin = user?.role === UserRole.admin;

    const tabs: SingleTab[] = [
      {
        to: `${basePath}/data`,
        text: 'application.tenantSettingsBasicData',
        icon: <InfoCircle />,
      },

      {
        to: `${basePath}/appearance`,
        text: 'application.tenantSettingsAppearance',
        icon: <Home />,
      },
      {
        to: `${basePath}/fonts`,
        text: 'application.tenantSettingsFonts',
        icon: <Size />,
      },
      {
        to: `${basePath}/slides`,
        text: 'application.slides',
        icon: <Templates />,
      },
      {
        to: `${basePath}/smtp`,
        text: 'application.tenantSettingsSmtp',
        icon: <Message />,
      },
      {
        to: `${basePath}/documents`,
        text: 'application.documents',
        icon: <List />,
      },
      {
        to: `${basePath}/messaging`,
        text: 'application.tenantSettingsMessaging',
        icon: <Alert />,
      },
      ...(isAdmin
        ? [
            {
              to: `${basePath}/templates`,
              text: 'application.templates',
              icon: <Templates />,
            },
            {
              to: `${basePath}/mobile-apps`,
              text: 'application.tenantSettingsMobileApps',
              icon: <HomeWifi />,
            },
            {
              to: `${basePath}/analytics`,
              text: 'application.tenantSettingsAnalytics',
              icon: <Adjustments />,
            },
          ]
        : []),
    ];

    return { basePath, tabs };
  }, [user, basePathOverride]);
};
