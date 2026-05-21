import {
  AppstoreAddOutlined,
  DatabaseOutlined,
  HomeOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Drawer,
  Flex,
  Layout,
  Menu,
  Typography,
  theme,
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
import HomePage from "./pages/HomePage";
import BusinessEntitiesPage from "./pages/BusinessEntitiesPage";
import BusinessEntityDetailPage from "./pages/BusinessEntityDetailPage";
import BusinessEntityManagementPage from "./pages/BusinessEntityManagementPage";
import { getEntities } from "./services/entityService";
import type { BusinessEntity } from "./types";

const { Content, Header, Sider } = Layout;
const { Text, Title } = Typography;

function buildMenuItems(entities: BusinessEntity[]): MenuProps["items"] {
  return [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Inicio",
    },
    {
      key: "/entities",
      icon: <DatabaseOutlined />,
      label: "Entidades de negocio",
    },
    {
      key: "generated-management",
      icon: <AppstoreAddOutlined />,
      label: "Gestión generada",
      children:
        entities.length > 0
          ? entities.map((entity) => ({
              key: `/management/${entity.id}`,
              label: entity.name,
            }))
          : [
              {
                key: "no-generated-entities",
                label: "Sin entidades creadas",
                disabled: true,
              },
            ],
    },
  ];
}

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [entities, setEntities] = useState<BusinessEntity[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const selectedKey = location.pathname.startsWith("/management/")
    ? location.pathname
    : location.pathname.startsWith("/entities")
      ? "/entities"
      : "/";
  const menuItems = buildMenuItems(entities);

  useEffect(() => {
    const loadEntities = () => {
      getEntities()
        .then(setEntities)
        .catch(() => setEntities([]));
    };

    loadEntities();
    window.addEventListener("business-entities:changed", loadEntities);

    return () => {
      window.removeEventListener("business-entities:changed", loadEntities);
    };
  }, []);

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key.startsWith("/")) {
      navigate(key);
      setIsMenuOpen(false);
    }
  };

  const navigationMenu = (
    <>
      <div className="brand">
        <div className="brand-mark">LC</div>
        <div>
          <Text className="brand-label">Tesis de maestría</Text>
          <Title level={4} className="brand-title">
            Plataforma Low Code
          </Title>
        </div>
      </div>
      <Menu
        mode="inline"
        theme="dark"
        items={menuItems}
        defaultOpenKeys={["generated-management"]}
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
    <ConfigProvider
      locale={esES}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          borderRadius: 8,
          colorBgLayout: "#eef3f8",
          colorPrimary: "#2f6f73",
          fontFamily:
            'Nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
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
      }}
    >
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ConfigProvider>
  );
}
