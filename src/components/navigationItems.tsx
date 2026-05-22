import AccountTreeOutlined from "@mui/icons-material/AccountTreeOutlined";
import DashboardCustomizeOutlined from "@mui/icons-material/DashboardCustomizeOutlined";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import type { ReactNode } from "react";
import type { BusinessEntity } from "../types";

export const GENERATED_MANAGEMENT_MENU_KEY = "generated-management";

export type NavigationItem = {
  disabled?: boolean;
  icon?: ReactNode;
  key: string;
  label: string;
};

export type NavigationGroup = NavigationItem & {
  children?: NavigationItem[];
};

export function getSelectedMenuKey(pathname: string) {
  if (pathname.startsWith("/management/")) {
    return pathname;
  }

  if (pathname.startsWith("/entities")) {
    return "/entities";
  }

  return "/";
}

export function buildMenuItems(entities: BusinessEntity[]): NavigationGroup[] {
  return [
    {
      icon: <HomeOutlined />,
      key: "/",
      label: "Inicio",
    },
    {
      icon: <AccountTreeOutlined />,
      key: "/entities",
      label: "Entidades de negocio",
    },
    {
      children:
        entities.length > 0
          ? entities.map((entity) => ({
              key: `/management/${entity.id}`,
              label: entity.name,
            }))
          : [
              {
                disabled: true,
                key: "no-generated-entities",
                label: "Sin entidades creadas",
              },
            ],
      icon: <DashboardCustomizeOutlined />,
      key: GENERATED_MANAGEMENT_MENU_KEY,
      label: "Gestión generada",
    },
  ];
}
