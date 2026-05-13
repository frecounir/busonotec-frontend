import { Alert, Card, Col, Flex, Row, Spin, Statistic, Typography } from "antd";
import type { TourProps } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getEntityById } from "../services/entityService";
import { getFields, createField } from "../services/fieldService";
import FieldsTable from "../components/FieldsTable";
import FieldForm from "../components/FieldForm";
import PageGuide from "../components/PageGuide";
import type { CreateFieldInput } from "../services/fieldService";
import type { BusinessEntity, EntityField } from "../types";

const { Paragraph, Text, Title } = Typography;

export default function BusinessEntityDetailPage() {
  const { id } = useParams();
  const [entity, setEntity] = useState<BusinessEntity | null>(null);
  const [fields, setFields] = useState<EntityField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const steps: TourProps["steps"] = [
    {
      title: "Revisa la entidad",
      description:
        "Aquí se muestra la entidad que estás configurando. Piensa en ella como una carpeta o categoría principal donde se guardará información del negocio. La descripción ayuda a que otras personas entiendan para qué existe.",
      target: () => summaryRef.current as HTMLElement,
    },
    {
      title: "Mide la configuración",
      description:
        "Estos indicadores muestran cuántos datos se han definido para la entidad. Mientras más campos agregues, más completa será la información que se podrá registrar después en la pantalla generada.",
      target: () => statsRef.current as HTMLElement,
    },
    {
      title: "Agrega campos dinámicos",
      description:
        "Un campo es un dato específico que quieres guardar. Por ejemplo, para Estudiantes podrías crear nombre como Texto, puntaje como Número, fecha_ingreso como Fecha y activo como Verdadero/Falso. Estos campos serán usados para crear el formulario automáticamente.",
      target: () => formRef.current as HTMLElement,
    },
    {
      title: "Valida la estructura",
      description:
        "Esta tabla funciona como una vista previa de la estructura de la entidad. Si aquí aparecen los campos correctos, la pantalla generada de gestión podrá pedir y mostrar la información adecuada para cada registro.",
      target: () => tableRef.current as HTMLElement,
    },
  ];

  const load = async () => {
    if (!id) {
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const [entityResponse, fieldsResponse] = await Promise.all([
        getEntityById(id),
        getFields(id),
      ]);
      setEntity(entityResponse);
      setFields(fieldsResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateField = async (
    data: Omit<CreateFieldInput, "businessEntityId">,
  ) => {
    if (!id) {
      return;
    }

    try {
      setError(null);
      setIsCreating(true);
      await createField({ ...data, businessEntityId: id });
      await load();
    } catch {
      setError("No fue posible crear el campo.");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    let isActive = true;

    Promise.all([getEntityById(id), getFields(id)])
      .then(([entityResponse, fieldsResponse]) => {
        if (isActive) {
          setEntity(entityResponse);
          setFields(fieldsResponse);
        }
      })
      .catch(() => {
        if (isActive) {
          setError(
            "No fue posible cargar la información de la entidad de negocio.",
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  return (
    <section className="page-stack">
      {error && <Alert title={error} type="error" showIcon />}

      <Spin
        spinning={isLoading}
        description="Cargando configuración de la entidad..."
      >
        <div className="page-stack">
          <div ref={summaryRef}>
            <Card className="page-card">
              <Flex align="flex-start" gap={16} justify="space-between" wrap>
                <div>
                  <Text type="secondary" strong>
                    Entidad de negocio
                  </Text>
                  <Title level={2}>
                    {entity?.name || "Detalle de la entidad"}
                  </Title>
                </div>
                <PageGuide steps={steps} />
              </Flex>
              <Paragraph>
                {entity?.description ||
                  "No se ha definido una descripción para esta entidad."}
              </Paragraph>
            </Card>
          </div>

          <div ref={statsRef}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card className="insight-card">
                  <Statistic title="Campos definidos" value={fields.length} />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card className="insight-card">
                  <Statistic
                    title="Módulo generado"
                    value={entity ? "Listo" : "Pendiente"}
                  />
                </Card>
              </Col>
            </Row>
          </div>

          <div ref={formRef}>
            <FieldForm isSubmitting={isCreating} onCreate={handleCreateField} />
          </div>

          <div ref={tableRef}>
            <Card title="Campos definidos" className="section-card">
              <FieldsTable fields={fields} />
            </Card>
          </div>
        </div>
      </Spin>
    </section>
  );
}
