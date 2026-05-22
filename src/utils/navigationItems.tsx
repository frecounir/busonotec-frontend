import {
  AppstoreAddOutlined,
  DatabaseOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import type { BusinessEntity } from "../types";

export const GENERATED_MANAGEMENT_MENU_KEY = "generated-management";

export function getSelectedMenuKey(pathname: string) {
  if (pathname.startsWith("/management/")) {
    return pathname;
  }

  if (pathname.startsWith("/entities")) {
    return "/entities";
  }

  return "/";
}

export function buildMenuItems(entities: BusinessEntity[]): MenuProps["items"] {
  return [
    {
      icon: <HomeOutlined />,
      key: "/",
      label: "Inicio",
    },
    {
      icon: <DatabaseOutlined />,
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
      icon: <AppstoreAddOutlined />,
      key: GENERATED_MANAGEMENT_MENU_KEY,
      label: "Gestión generada",
    },
  ];
}
