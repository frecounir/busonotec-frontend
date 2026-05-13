import {
  AppstoreAddOutlined,
  BuildOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { Card, Col, Flex, Row, Statistic, Typography } from "antd";
import type { TourProps } from "antd";
import { useRef } from "react";
import PageGuide from "../components/PageGuide";

const { Paragraph, Text, Title } = Typography;

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const steps: TourProps["steps"] = [
    {
      title: "Propósito de la plataforma",
      description:
        "Esta pantalla presenta la idea general del sistema. En lugar de pedirle a una persona que programe una pantalla desde cero, la plataforma permite describir qué información necesita manejar el negocio y luego usa esa configuración para construir partes de la aplicación.",
      target: () => heroRef.current as HTMLElement,
    },
    {
      title: "Ejemplo concreto",
      description:
        "Por ejemplo, si una institución quiere manejar estudiantes, primero crea la entidad Estudiantes. Después define qué datos quiere guardar, como nombre, correo y puntaje. Con esa información, el sistema puede habilitar una pantalla para registrar y consultar estudiantes.",
      target: () => metricsRef.current as HTMLElement,
    },
  ];

  return (
    <section className="page-stack">
      <div ref={heroRef}>
        <Card className="hero-card">
          <Flex align="flex-start" gap={16} justify="space-between" wrap>
            <div>
              <Text type="secondary" strong>
                Generación dinámica de backend
              </Text>
              <Title level={1}>
                Plataforma Low Code para entidades de negocio
              </Title>
            </div>
            <PageGuide steps={steps} />
          </Flex>
          <Paragraph className="lead">
            Este sistema permite crear entidades de negocio de forma dinámica y
            definir su estructura mediante campos, facilitando la generación
            automática de esquemas de backend y componentes de interfaz de
            usuario.
          </Paragraph>
          <Paragraph>
            La aplicación adopta un enfoque guiado por configuración para
            modelar conceptos del negocio, aportando una base frontend clara
            para el contexto investigativo de la tesis de maestría.
          </Paragraph>
        </Card>
      </div>

      <div ref={metricsRef}>
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
      </div>
    </section>
  );
}
