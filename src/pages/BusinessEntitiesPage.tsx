import { Alert, Card, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { getEntities, createEntity } from "../services/entityService";
import EntitiesTable from "../components/EntitiesTable";
import EntityForm from "../components/EntityForm";
import type { CreateEntityInput } from "../services/entityService";
import type { BusinessEntity } from "../types";

const { Text, Title } = Typography;

export default function BusinessEntitiesPage() {
  const [entities, setEntities] = useState<BusinessEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
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
      await load();
    } catch {
      setError("The business entity could not be created.");
    } finally {
      setIsCreating(false);
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
          setError("Business entities could not be loaded.");
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
      <div>
        <Text type="secondary" strong>
          Configuration
        </Text>
        <Title level={2}>Business Entities</Title>
      </div>

      <EntityForm isSubmitting={isCreating} onCreate={handleCreate} />

      {error && <Alert message={error} type="error" showIcon />}

      <Card title="Configured entities" className="section-card">
        <Spin spinning={isLoading} tip="Loading business entities...">
          <EntitiesTable entities={entities} />
        </Spin>
      </Card>
    </section>
  );
}
