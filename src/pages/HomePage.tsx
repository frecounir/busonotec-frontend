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
          Generación dinámica de backend
        </Text>
        <Title level={1}>Plataforma Low Code para entidades de negocio</Title>
        <Paragraph className="lead">
          Este sistema permite crear entidades de negocio de forma dinámica y
          definir su estructura mediante campos, facilitando la generación
          automática de esquemas de backend y componentes de interfaz de
          usuario.
        </Paragraph>
        <Paragraph>
          La aplicación adopta un enfoque guiado por configuración para modelar
          conceptos del negocio, aportando una base frontend clara para el
          contexto investigativo de la tesis de maestría.
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="insight-card">
            <Statistic
              prefix={<DatabaseOutlined />}
              title="Modelado de entidades"
              value="Dinámico"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="insight-card">
            <Statistic
              prefix={<BuildOutlined />}
              title="Generación de esquemas"
              value="Automatizada"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="insight-card">
            <Statistic
              prefix={<AppstoreAddOutlined />}
              title="Módulos generados"
              value="Configurables"
            />
          </Card>
        </Col>
      </Row>
    </section>
  );
}
