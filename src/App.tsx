import { MenuOutlined } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Drawer,
  Flex,
  Layout,
  Menu,
  Typography,
} from "antd";
import esES from "antd/locale/es_ES";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import AppBrand from "./components/AppBrand";
import { appTheme } from "./config/appTheme";
import HomePage from "./pages/HomePage";
import BusinessEntitiesPage from "./pages/BusinessEntitiesPage";
import BusinessEntityDetailPage from "./pages/BusinessEntityDetailPage";
import BusinessEntityManagementPage from "./pages/BusinessEntityManagementPage";
import { getEntities } from "./services/entityService";
import type { BusinessEntity } from "./types";
import { subscribeToBusinessEntitiesChanges } from "./utils/businessEntityEvents";
import {
  buildMenuItems,
  GENERATED_MANAGEMENT_MENU_KEY,
  getSelectedMenuKey,
} from "./utils/navigationItems";

const { Content, Header, Sider } = Layout;
const { Text } = Typography;

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [entities, setEntities] = useState<BusinessEntity[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedKey = getSelectedMenuKey(location.pathname);
  const menuItems = buildMenuItems(entities);

  useEffect(() => {
    const loadEntities = () => {
      getEntities()
        .then(setEntities)
        .catch(() => setEntities([]));
    };

    loadEntities();
    return subscribeToBusinessEntitiesChanges(loadEntities);
  }, []);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("/")) {
      navigate(key);
      setIsMenuOpen(false);
    }
  };

  const navigationMenu = (
    <>
      <AppBrand />
      <Menu
        mode="inline"
        theme="dark"
        items={menuItems}
        defaultOpenKeys={[GENERATED_MANAGEMENT_MENU_KEY]}
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
      />
    </>
  );

  return (
    <Layout className="app-layout">
      <Sider width={292} className="app-sider">
        {navigationMenu}
      </Sider>
      <Drawer
        className="mobile-navigation"
        onClose={() => setIsMenuOpen(false)}
        open={isMenuOpen}
        placement="left"
        size={300}
        title={null}
      >
        {navigationMenu}
      </Drawer>
      <Layout>
        <Header className="mobile-header">
          <Flex align="center" justify="space-between">
            <Button
              aria-label="Abrir menú de navegación"
              icon={<MenuOutlined />}
              onClick={() => setIsMenuOpen(true)}
            />
            <Text strong>Plataforma Low Code</Text>
          </Flex>
        </Header>
        <Content className="app-content">
          <div className="content-panel">
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
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <ConfigProvider locale={esES} theme={appTheme}>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ConfigProvider>
  );
}
