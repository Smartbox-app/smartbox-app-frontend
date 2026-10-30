import React, { useMemo } from 'react';

import { UserRole } from 'smartbox-types';
import { useTenant } from 'src/hooks/useTenant';
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
  Calendar,
  Wallet,
} from 'src/icons';
import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { SingleTab } from 'src/types/tab';

export const TENANT_SETTINGS_DEFAULT_SEGMENT = 'appearance';

export const useTenantSettingsTabs = (
  basePathOverride?: string,
): {
  basePath: string;
  tabs: SingleTab[];
} => {
  const { data: user } = useGetMyDetailsQuery();
  const { tenant } = useTenant();

  return useMemo(() => {
    const slug = UserService.getSlugByRole(user?.role as UserRole);
    const basePath = basePathOverride ?? `/${slug}/management/settings`;
    const isAdmin = user?.role === UserRole.admin;
    const hasTracking = Boolean(tenant?.gtmId || tenant?.metaPixelId);

    const tabs: SingleTab[] = [
      {
        to: `${basePath}/data`,
        text: 'application.tenantSettingsBasicData',
        icon: <InfoCircle />,
      },
      {
        to: `${basePath}/agreements`,
        text: 'application.tenantSettingsAgreements',
        icon: <Calendar />,
      },
      {
        to: `${basePath}/communications`,
        text: 'application.tenantSettingsCommunications',
        icon: <Alert />,
      },
      {
        to: `${basePath}/integrations`,
        text: 'application.tenantSettingsIntegrations',
        icon: <Wallet />,
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
        to: `${basePath}/mobile-apps`,
        text: 'application.tenantSettingsMobileApps',
        icon: <HomeWifi />,
      },
      ...(isAdmin
        ? [
            {
              to: `${basePath}/templates`,
              text: 'application.templates',
              icon: <Templates />,
            },
          ]
        : []),
      ...(isAdmin || hasTracking
        ? [
            {
              to: `${basePath}/analytics`,
              text: 'application.tenantSettingsAnalytics',
              icon: <Adjustments />,
            },
          ]
        : []),
    ];

    return { basePath, tabs };
  }, [user, basePathOverride, tenant?.gtmId, tenant?.metaPixelId]);
};
