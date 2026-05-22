import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ExpandLessOutlined from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlined from "@mui/icons-material/ExpandMoreOutlined";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import type { BusinessEntity } from "../types";
import AppBrand from "./AppBrand";
import {
  buildMenuItems,
  getSelectedMenuKey,
  type NavigationGroup,
  type NavigationItem,
} from "./navigationItems";

type AppNavigationProps = {
  entities: BusinessEntity[];
  onClose?: () => void;
  onNavigate: (path: string) => void;
  pathname: string;
};

export default function AppNavigation({
  entities,
  onClose,
  onNavigate,
  pathname,
}: AppNavigationProps) {
  const [isManagementOpen, setIsManagementOpen] = useState(true);
  const selectedKey = getSelectedMenuKey(pathname);
  const menuItems = buildMenuItems(entities);

  const navigateTo = (item: NavigationItem) => {
    if (item.disabled || !item.key.startsWith("/")) {
      return;
    }

    onNavigate(item.key);
  };

  const renderNavigationItem = (item: NavigationItem) => (
    <ListItemButton
      key={item.key}
      disabled={item.disabled}
      selected={selectedKey === item.key}
      sx={{
        borderRadius: 2,
        color: "rgba(255, 255, 255, 0.78)",
        mx: 1.5,
        my: 0.25,
        "&.Mui-disabled": {
          color: "rgba(255, 255, 255, 0.38)",
        },
        "&.Mui-selected": {
          bgcolor: "rgba(217, 240, 223, 0.18)",
          color: "#ffffff",
        },
        "&.Mui-selected:hover, &:hover": {
          bgcolor: "rgba(217, 240, 223, 0.14)",
        },
      }}
      onClick={() => navigateTo(item)}
    >
      {item.icon && (
        <ListItemIcon sx={{ color: "inherit", minWidth: 38 }}>
          {item.icon}
        </ListItemIcon>
      )}
      <ListItemText primary={item.label} />
    </ListItemButton>
  );

  const renderNavigationGroup = (item: NavigationGroup) => {
    if (!item.children) {
      return renderNavigationItem(item);
    }

    return (
      <Box key={item.key}>
        <ListItemButton
          sx={{
            borderRadius: 2,
            color: "rgba(255, 255, 255, 0.78)",
            mx: 1.5,
            my: 0.25,
            "&:hover": { bgcolor: "rgba(217, 240, 223, 0.14)" },
          }}
          onClick={() => setIsManagementOpen((currentValue) => !currentValue)}
        >
          {item.icon && (
            <ListItemIcon sx={{ color: "inherit", minWidth: 38 }}>
              {item.icon}
            </ListItemIcon>
          )}
          <ListItemText primary={item.label} />
          {isManagementOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
        </ListItemButton>
        <Collapse in={isManagementOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {item.children.map((child) => renderNavigationItem(child))}
          </List>
        </Collapse>
      </Box>
    );
  };

  return (
    <Box className="app-navigation">
      <Box sx={{ position: "relative" }}>
        <AppBrand />
        {onClose && (
          <IconButton
            aria-label="Ocultar menú de navegación"
            sx={{
              color: "#ffffff",
              position: "absolute",
              right: 12,
              top: 14,
            }}
            onClick={onClose}
          >
            <CloseOutlined />
          </IconButton>
        )}
      </Box>
      <List>{menuItems.map((item) => renderNavigationGroup(item))}</List>
    </Box>
  );
}
