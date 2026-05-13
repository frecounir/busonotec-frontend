import { Alert, Card, Col, Flex, Row, Spin, Statistic, Typography } from "antd";
import type { TourProps } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  getEntities,
  createEntity,
  deleteEntity,
} from "../services/entityService";
import EntitiesTable from "../components/EntitiesTable";
import EntityForm from "../components/EntityForm";
import PageGuide from "../components/PageGuide";
import type { CreateEntityInput } from "../services/entityService";
import type { BusinessEntity } from "../types";

const { Text, Title } = Typography;

export default function BusinessEntitiesPage() {
  const [entities, setEntities] = useState<BusinessEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingEntityId, setDeletingEntityId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const steps: TourProps["steps"] = [
    {
      title: "Define entidades de negocio",
      description:
        "Una entidad de negocio es algo importante para la organización y sobre lo cual se necesita guardar información. Puede ser Estudiantes, Clientes, Cursos, Productos, Solicitudes o cualquier concepto propio del proceso que se quiere gestionar.",
      target: () => headingRef.current as HTMLElement,
    },
    {
      title: "Observa el avance de configuración",
      description:
        "Estos números ayudan a entender cuánto se ha configurado hasta el momento. Cada entidad creada se convierte en una opción del menú lateral, lo que significa que el sistema empieza a construir secciones de trabajo a partir de lo definido por el usuario.",
      target: () => statsRef.current as HTMLElement,
    },
    {
      title: "Crea una entidad",
      description:
        "Para crear una entidad, escribe un nombre claro y una descripción breve. Por ejemplo: nombre Estudiantes y descripción Personas inscritas en actividades académicas. No hace falta saber de programación; basta con describir el concepto del negocio.",
      target: () => formRef.current as HTMLElement,
    },
    {
      title: "Administra la entidad",
      description:
        "La tabla muestra las entidades ya creadas. El botón Gestionar permite definir qué datos tendrá esa entidad. El botón Eliminar debe usarse con cuidado, porque elimina la entidad, sus campos y la información técnica asociada.",
      target: () => tableRef.current as HTMLElement,
    },
  ];

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
      <div ref={headingRef} className="page-heading">
        <Flex align="flex-start" gap={16} justify="space-between" wrap>
          <div>
            <Text type="secondary" strong>
              Configuración
            </Text>
            <Title level={2}>Entidades de negocio</Title>
          </div>
          <PageGuide steps={steps} />
        </Flex>
      </div>

      <div ref={statsRef}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card className="insight-card">
              <Statistic
                title="Entidades configuradas"
                value={entities.length}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card className="insight-card">
              <Statistic title="Opciones generadas" value={entities.length} />
            </Card>
          </Col>
        </Row>
      </div>

      <div ref={formRef}>
        <EntityForm isSubmitting={isCreating} onCreate={handleCreate} />
      </div>

      {error && <Alert title={error} type="error" showIcon />}

      <div ref={tableRef}>
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
      </div>
    </section>
  );
}
