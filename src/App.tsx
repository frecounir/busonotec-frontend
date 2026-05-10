import {
  AppstoreAddOutlined,
  DatabaseOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Layout, Menu, Typography, theme } from "antd";
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

const { Content, Sider } = Layout;
const { Text, Title } = Typography;

function buildMenuItems(entities: BusinessEntity[]): MenuProps["items"] {
  return [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/entities",
      icon: <DatabaseOutlined />,
      label: "Business Entities",
    },
    {
      key: "generated-management",
      icon: <AppstoreAddOutlined />,
      label: "Generated Management",
      children:
        entities.length > 0
          ? entities.map((entity) => ({
              key: `/management/${entity.id}`,
              label: entity.name,
            }))
          : [
              {
                key: "no-generated-entities",
                label: "No entities created",
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

  return (
    <Layout className="app-layout">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        width={280}
        className="app-sider"
      >
        <div className="brand">
          <Text className="brand-label">Master's thesis</Text>
          <Title level={4} className="brand-title">
            Low-Code Platform
          </Title>
        </div>
        <Menu
          mode="inline"
          theme="dark"
          items={menuItems}
          defaultOpenKeys={["generated-management"]}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            if (key.startsWith("/")) {
              navigate(key);
            }
          }}
        />
      </Sider>
      <Layout>
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/entities" element={<BusinessEntitiesPage />} />
            <Route
              path="/entities/:id"
              element={<BusinessEntityDetailPage />}
            />
            <Route
              path="/management"
              element={<BusinessEntityManagementPage key={location.pathname} />}
            />
            <Route
              path="/management/:entityId"
              element={<BusinessEntityManagementPage key={location.pathname} />}
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          borderRadius: 8,
          colorPrimary: "#2563eb",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </ConfigProvider>
  );
}
