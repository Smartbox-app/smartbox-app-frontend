export interface MenuItemType {
  icon: string | null;
  text: string;
  badge?: boolean;
  address?: string;
  onClick?: () => void;
  customClass?: string;
}
