import {
  AppstoreAddOutlined,
  BuildOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

export default function HomePage() {
  return (
    <section className="page-stack">
      <Card className="hero-card">
        <Text type="secondary" strong>
          Dynamic backend generation
        </Text>
        <Title level={1}>Low-Code Business Entity Platform</Title>
        <Paragraph className="lead">
          This system allows users to dynamically create business entities and
          define their structure through fields, enabling the automatic
          generation of backend schemas and user interface components.
        </Paragraph>
        <Paragraph>
          The application supports a configuration-driven approach for modeling
          business concepts, providing a clear frontend foundation for the
          master's thesis research context.
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="insight-card">
            <Statistic
              prefix={<DatabaseOutlined />}
              title="Entity modeling"
              value="Dynamic"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="insight-card">
            <Statistic
              prefix={<BuildOutlined />}
              title="Schema generation"
              value="Automated"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="insight-card">
            <Statistic
              prefix={<AppstoreAddOutlined />}
              title="Generated modules"
              value="Configurable"
            />
          </Card>
        </Col>
      </Row>
    </section>
  );
}
