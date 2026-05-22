import { theme } from "antd";
import type { ThemeConfig } from "antd";

export const appTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  components: {
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary: "0 16px 40px rgba(25, 40, 57, 0.08)",
    },
    Layout: {
      siderBg: "#17363a",
      triggerBg: "#17363a",
    },
    Menu: {
      darkItemBg: "#17363a",
      darkItemHoverBg: "#245156",
      darkItemSelectedBg: "#2f6f73",
    },
  },
  token: {
    borderRadius: 8,
    colorBgLayout: "#eef3f8",
    colorPrimary: "#2f6f73",
    fontFamily:
      'Nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
};
