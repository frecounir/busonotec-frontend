import { DatabaseOutlined, HomeOutlined } from "@ant-design/icons";
import { ConfigProvider, Layout, Menu, Typography, theme } from "antd";
import type { MenuProps } from "antd";
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

const { Content, Sider } = Layout;
const { Text, Title } = Typography;

const menuItems: MenuProps["items"] = [
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
];

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = location.pathname.startsWith("/entities")
    ? "/entities"
    : "/";

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
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(key)}
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
