import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEntityById } from "../services/entityService";
import { getFields, createField } from "../services/fieldService";
import FieldsTable from "../components/FieldsTable";
import FieldForm from "../components/FieldForm";
import type { CreateFieldInput } from "../services/fieldService";
import type { BusinessEntity, EntityField } from "../types";

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
      setError("The field could not be created.");
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
          setError("The business entity information could not be loaded.");
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
    <section className="page-section">
      {isLoading ? (
        <p className="loading-message">Loading entity configuration...</p>
      ) : (
        <>
          <div className="page-header">
            <div>
              <p className="eyebrow">Business entity</p>
              <h2>{entity?.name || "Entity detail"}</h2>
              <p>
                {entity?.description ||
                  "No description has been defined for this entity."}
              </p>
            </div>
          </div>

          <section className="subsection">
            <h3>Fields</h3>
            <FieldForm isSubmitting={isCreating} onCreate={handleCreateField} />
            <FieldsTable fields={fields} />
          </section>
        </>
      )}

      {error && <p className="error-message">{error}</p>}
    </section>
  );
}
