import { ReactNode } from "react";

export type SingleTab = {
    icon: ReactNode;
    onClick?: () => void;
    to?: string;
    active?: boolean;
    text: string;
  }