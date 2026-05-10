import { Card, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

export default function HomePage() {
  return (
    <Card className="page-card">
      <Text type="secondary" strong>
        Dynamic backend generation
      </Text>
      <Title level={2}>Low-Code Business Entity Platform</Title>
      <Paragraph className="lead">
        This system allows users to dynamically create business entities and
        define their structure through fields, enabling the automatic generation
        of backend schemas and user interface components.
      </Paragraph>
      <Paragraph>
        The application supports a configuration-driven approach for modeling
        business concepts, providing a clear frontend foundation for the
        master's thesis research context.
      </Paragraph>
    </Card>
  );
}
