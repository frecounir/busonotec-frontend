import { Typography } from "antd";

const { Text, Title } = Typography;

export default function AppBrand() {
  return (
    <div className="brand">
      <div className="brand-mark">LC</div>
      <div>
        <Text className="brand-label">Tesis de maestría</Text>
        <Title level={4} className="brand-title">
          Plataforma Low Code
        </Title>
      </div>
    </div>
  );
}
