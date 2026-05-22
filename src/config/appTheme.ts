import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    background: {
      default: "#eef3f8",
      paper: "#ffffff",
    },
    error: {
      main: "#b42318",
    },
    primary: {
      dark: "#17363a",
      light: "#d9f0df",
      main: "#2f6f73",
    },
    secondary: {
      main: "#6f5bd7",
    },
    success: {
      main: "#2f7d5b",
    },
    text: {
      primary: "#17363a",
      secondary: "#5d6d7a",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    button: {
      fontWeight: 800,
      letterSpacing: 0,
      textTransform: "none",
    },
    fontFamily:
      'Nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: "2.4rem",
      fontWeight: 800,
      letterSpacing: 0,
      lineHeight: 1.12,
    },
    h2: {
      fontSize: "1.9rem",
      fontWeight: 800,
      letterSpacing: 0,
      lineHeight: 1.18,
    },
    h3: {
      fontSize: "1.45rem",
      fontWeight: 800,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(23, 54, 58, 0.08)",
          boxShadow: "0 16px 40px rgba(25, 40, 57, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});
