import { Alert, Card, Col, Row, Spin, Statistic, Typography } from "antd";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEntityById } from "../services/entityService";
import { getFields, createField } from "../services/fieldService";
import FieldsTable from "../components/FieldsTable";
import FieldForm from "../components/FieldForm";
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
        <Card className="page-card">
          <Text type="secondary" strong>
            Entidad de negocio
          </Text>
          <Title level={2}>{entity?.name || "Detalle de la entidad"}</Title>
          <Paragraph>
            {entity?.description ||
              "No se ha definido una descripción para esta entidad."}
          </Paragraph>
        </Card>

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

        <FieldForm isSubmitting={isCreating} onCreate={handleCreateField} />

        <Card title="Campos definidos" className="section-card">
          <FieldsTable fields={fields} />
        </Card>
      </Spin>
    </section>
  );
}
