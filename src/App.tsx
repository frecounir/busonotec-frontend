import CloseOutlined from "@mui/icons-material/CloseOutlined";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AppNavigation from "./components/AppNavigation";
import { appTheme } from "./config/appTheme";
import HomePage from "./pages/HomePage";
import BusinessEntitiesPage from "./pages/BusinessEntitiesPage";
import BusinessEntityDetailPage from "./pages/BusinessEntityDetailPage";
import BusinessEntityManagementPage from "./pages/BusinessEntityManagementPage";
import { getEntities } from "./services/entityService";
import type { BusinessEntity } from "./types";
import { subscribeToBusinessEntitiesChanges } from "./utils/businessEntityEvents";

const drawerWidth = 292;

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [entities, setEntities] = useState<BusinessEntity[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    const loadEntities = () => {
      getEntities()
        .then(setEntities)
        .catch(() => setEntities([]));
    };

    loadEntities();
    return subscribeToBusinessEntitiesChanges(loadEntities);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Box className="app-layout">
      <Drawer
        open={isMenuOpen}
        variant="persistent"
        sx={(theme) => ({
          width: drawerWidth,
          zIndex: theme.zIndex.drawer + 2,
          "& .MuiDrawer-paper": {
            bgcolor: "primary.dark",
            borderRight: 0,
            boxShadow: "10px 0 30px rgba(23, 54, 58, 0.14)",
            height: "100%",
            top: 0,
            width: drawerWidth,
            zIndex: theme.zIndex.drawer + 2,
          },
        })}
      >
        <AppNavigation
          entities={entities}
          onClose={() => setIsMenuOpen(false)}
          pathname={location.pathname}
          onNavigate={handleNavigate}
        />
      </Drawer>

      <Box
        className={isMenuOpen ? "app-shell app-shell-menu-open" : "app-shell"}
      >
        <AppBar
          className="mobile-header"
          elevation={0}
          position="sticky"
          sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })}
        >
          <Toolbar>
            <IconButton
              aria-label={
                isMenuOpen
                  ? "Ocultar menú de navegación"
                  : "Abrir menú de navegación"
              }
              color="inherit"
              edge="start"
              onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
            >
              {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
            </IconButton>
            <Typography sx={{ fontWeight: 800 }}>
              Plataforma Low Code
            </Typography>
          </Toolbar>
        </AppBar>

        <Box component="main" className="app-content">
          <Box className="content-panel">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/entities" element={<BusinessEntitiesPage />} />
              <Route
                path="/entities/:id"
                element={<BusinessEntityDetailPage />}
              />
              <Route
                path="/management"
                element={
                  <BusinessEntityManagementPage key={location.pathname} />
                }
              />
              <Route
                path="/management/:entityId"
                element={
                  <BusinessEntityManagementPage key={location.pathname} />
                }
              />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ThemeProvider>
  );
}
