import { useMemo } from 'react';

import { UserRole } from 'smartbox-types';
import { useTenant } from 'src/hooks/useTenant';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import type { NamingTypeKey } from 'src/i18n/types/keys';
import {
  Adjustments,
  Boxes,
  Calendar,
  Groups,
  Home,
  HomeWifi,
  Invitations,
  List,
  Message,
  Settings,
  Stocks,
  Stocks2,
  Templates,
  Users,
  Manage,
  Workers,
  Wallet,
} from 'src/icons';
import { useGetMyDetailsQuery, useSmsServiceStatusQuery } from 'src/queries';
import UserService from 'src/services/user-service';
import { SidebarNavGroup } from 'src/types/sidebar-nav';

type SidebarNavContext = {
  slug: string;
  getText: (key: NamingTypeKey) => string;
};

type ClientSidebarNavContext = SidebarNavContext & {
  smsStatus?: boolean;
  apiAccessEnabled?: boolean;
};

const getLocationsNavGroups = ({
  slug,
  getText,
}: SidebarNavContext): SidebarNavGroup[] => [
  {
    text: getText('many'),
    icon: <Stocks2 />,
    items: [
      {
        to: `/${slug}/locations/stocks/list`,
        text: getText('many'),
        icon: <Stocks2 />,
      },
      {
        to: `/${slug}/locations/groups/list`,
        text: getText('groups'),
        icon: <Stocks />,
      },
    ],
  },
];

const getAccountNavGroup = ({ slug }: SidebarNavContext): SidebarNavGroup => ({
  text: 'application.account',
  icon: <Settings />,
  items: [
    {
      to: `/${slug}/profile/detail`,
      text: 'application.account',
      icon: <Settings />,
    },
  ],
});

const getAdminSidebarNavGroups = ({
  slug,
  getText,
}: SidebarNavContext): SidebarNavGroup[] => {
  const managementBase = `/${slug}/management`;

  return [
    {
      text: 'application.management',
      icon: <Manage />,
      items: [
        {
          to: `${managementBase}/users`,
          text: 'application.users',
          icon: <Users />,
        },
        {
          to: `${managementBase}/workers`,
          text: 'application.workers',
          icon: <Workers />,
        },
        {
          to: `${managementBase}/clients`,
          text: 'application.tenants',
          icon: <Stocks />,
        },
        {
          to: `${managementBase}/invitations`,
          text: 'application.invitations',
          icon: <Invitations />,
        },
        {
          to: `${managementBase}/sms`,
          text: 'application.smsNotifications',
          icon: <Message />,
        },
        {
          to: `${managementBase}/settings`,
          text: 'application.settings',
          icon: <Adjustments />,
        },
        {
          to: `${managementBase}/settlements`,
          text: 'application.settlements',
          icon: <Wallet />,
        },
        {
          to: `${managementBase}/mobile-config`,
          text: 'application.mobileAppsConfig',
          icon: <Adjustments />,
        },
        {
          to: `${managementBase}/api-access`,
          text: 'application.apiAccess',
          icon: <Settings />,
        },
        {
          to: `${managementBase}/attachments`,
          text: 'application.attachments',
          icon: <Boxes />,
        },
        {
          to: `${managementBase}/documents`,
          text: 'application.documents',
          icon: <List />,
        },
        {
          to: `${managementBase}/notifications`,
          text: 'application.systemNotifications',
          icon: <Calendar />,
        },
        {
          to: `${managementBase}/system-logs`,
          text: 'application.systemLogs',
          icon: <List />,
        },
      ],
    },
    ...getLocationsNavGroups({ slug, getText }),
    {
      text: 'application.ttlock',
      icon: <HomeWifi />,
      items: [
        {
          to: `/${slug}/drivers/gateways`,
          text: 'application.gateways',
          icon: <HomeWifi />,
        },
        {
          to: `/${slug}/drivers/groups`,
          text: 'application.lockGroups',
          icon: <Groups />,
        },
        {
          to: `/${slug}/drivers/locks`,
          text: 'application.locks',
          icon: <Home />,
        },
      ],
    },
  ];
};

const getClientSidebarNavGroups = ({
  slug,
  getText,
  smsStatus,
  apiAccessEnabled,
}: ClientSidebarNavContext): SidebarNavGroup[] => {
  const managementBase = `/${slug}/management`;
  const managementItems = [
    {
      to: `${managementBase}/users/list`,
      text: 'application.users',
      icon: <Users />,
    },
    {
      to: `${managementBase}/workers`,
      text: 'application.workers',
      icon: <Workers />,
    },
    {
      to: `${managementBase}/invitations`,
      text: 'application.invitations',
      icon: <Invitations />,
    },
    {
      to: `${managementBase}/settings/appearance`,
      text: 'application.settings',
      icon: <Adjustments />,
    },
    {
      to: `${managementBase}/settlements`,
      text: 'application.settlements',
      icon: <Wallet />,
    },
    {
      to: `${managementBase}/templates`,
      text: 'application.templates',
      icon: <Templates />,
    },
    {
      to: `${managementBase}/attachments`,
      text: 'application.attachments',
      icon: <Boxes />,
    },
    {
      to: `${managementBase}/documents`,
      text: 'application.documents',
      icon: <List />,
    },
    {
      to: `${managementBase}/notifications`,
      text: 'application.systemNotifications',
      icon: <Calendar />,
    },
    {
      to: `${managementBase}/system-logs`,
      text: 'application.systemLogs',
      icon: <List />,
    },
  ];

  if (apiAccessEnabled) {
    managementItems.push({
      to: `${managementBase}/api-access`,
      text: 'application.apiAccess',
      icon: <Settings />,
    });
  }

  if (smsStatus) {
    managementItems.push({
      to: `${managementBase}/sms`,
      text: 'application.sendSms',
      icon: <Message />,
    });
  }

  return [
    {
      text: 'application.management',
      icon: <Manage />,
      items: managementItems,
    },
    ...getLocationsNavGroups({ slug, getText }),
  ];
};

const getWorkerSidebarNavGroups = ({
  slug,
  getText,
}: SidebarNavContext): SidebarNavGroup[] => {
  const managementBase = `/${slug}/management`;

  return [
    {
      text: 'application.management',
      icon: <Manage />,
      items: [
        {
          to: `${managementBase}/users/list`,
          text: 'application.users',
          icon: <Users />,
        },
        {
          to: `${managementBase}/invitations`,
          text: 'application.invitations',
          icon: <Invitations />,
        },
      ],
    },
    ...getLocationsNavGroups({ slug, getText }),
  ];
};

const getSidebarNavGroupsForRole = (
  role: UserRole,
  ctx: ClientSidebarNavContext,
): SidebarNavGroup[] => {
  switch (role) {
    case UserRole.admin:
      return getAdminSidebarNavGroups(ctx);
    case UserRole.client:
      return getClientSidebarNavGroups(ctx);
    case UserRole.worker:
      return getWorkerSidebarNavGroups(ctx);
    default:
      return [];
  }
};

export const useDashboardSidebarNav = (): SidebarNavGroup[] => {
  const { data: user } = useGetMyDetailsQuery();
  const { getText } = useTenantNaming();
  const { tenant } = useTenant();
  const isClient = user?.role === UserRole.client;
  const { data: smsStatus } = useSmsServiceStatusQuery(
    isClient ? tenant?.id : undefined,
  );
  const hasApiAccess =
    tenant && 'hasApiAccess' in tenant ? tenant.hasApiAccess : false;

  return useMemo(() => {
    if (!user) return [];

    const slug = UserService.getSlugByRole(user.role as UserRole);
    if (!slug) return [];

    const ctx: ClientSidebarNavContext = {
      slug,
      getText,
      smsStatus,
      apiAccessEnabled: hasApiAccess,
    };

    return [
      ...getSidebarNavGroupsForRole(user.role as UserRole, ctx),
      getAccountNavGroup(ctx),
    ];
  }, [user, getText, smsStatus, hasApiAccess]);
};
