import { ReactNode } from "react";

export interface MenuItemType {
  icon: ReactNode;
  text: string;
  to?: string;
  onClick?: () => void;
}
