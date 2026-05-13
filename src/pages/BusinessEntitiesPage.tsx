import { Alert, Card, Col, Row, Spin, Statistic, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  getEntities,
  createEntity,
  deleteEntity,
} from "../services/entityService";
import EntitiesTable from "../components/EntitiesTable";
import EntityForm from "../components/EntityForm";
import type { CreateEntityInput } from "../services/entityService";
import type { BusinessEntity } from "../types";

const { Text, Title } = Typography;

export default function BusinessEntitiesPage() {
  const [entities, setEntities] = useState<BusinessEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingEntityId, setDeletingEntityId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const entitiesResponse = await getEntities();
      setEntities(entitiesResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateEntityInput) => {
    try {
      setError(null);
      setIsCreating(true);
      await createEntity(data);
      window.dispatchEvent(new Event("business-entities:changed"));
      await load();
    } catch {
      setError("No fue posible crear la entidad de negocio.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (entity: BusinessEntity) => {
    try {
      setError(null);
      setDeletingEntityId(entity.id);
      await deleteEntity(entity.id);
      window.dispatchEvent(new Event("business-entities:changed"));
      await load();
    } catch {
      setError("No fue posible eliminar la entidad de negocio.");
    } finally {
      setDeletingEntityId(null);
    }
  };

  useEffect(() => {
    let isActive = true;

    getEntities()
      .then((entitiesResponse) => {
        if (isActive) {
          setEntities(entitiesResponse);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("No fue posible cargar las entidades de negocio.");
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
  }, []);

  return (
    <section className="page-stack">
      <div className="page-heading">
        <Text type="secondary" strong>
          Configuración
        </Text>
        <Title level={2}>Entidades de negocio</Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card className="insight-card">
            <Statistic title="Entidades configuradas" value={entities.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card className="insight-card">
            <Statistic title="Opciones generadas" value={entities.length} />
          </Card>
        </Col>
      </Row>

      <EntityForm isSubmitting={isCreating} onCreate={handleCreate} />

      {error && <Alert title={error} type="error" showIcon />}

      <Card title="Entidades configuradas" className="section-card">
        <Spin
          spinning={isLoading}
          description="Cargando entidades de negocio..."
        >
          <EntitiesTable
            deletingEntityId={deletingEntityId}
            entities={entities}
            onDelete={handleDelete}
          />
        </Spin>
      </Card>
    </section>
  );
}
