import { ReactNode } from 'react';

export type SidebarNavItem = {
  to?: string;
  text: string;
  icon?: ReactNode;
  onClick?: () => void;
  active?: boolean;
};

export type SidebarNavGroup = {
  text: string;
  icon?: ReactNode;
  items: SidebarNavItem[];
};
