import {
  Alert,
  Card,
  Col,
  Empty,
  Row,
  Spin,
  Statistic,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EntityRecordForm from "../components/EntityRecordForm";
import EntityRecordsTable from "../components/EntityRecordsTable";
import { getEntityById } from "../services/entityService";
import { getFields } from "../services/fieldService";
import {
  createEntityRecord,
  deleteEntityRecord,
  getEntityRecords,
  updateEntityRecord,
} from "../services/entityRecordService";
import type {
  BusinessEntity,
  EntityField,
  EntityRecord,
  EntityRecordPayload,
} from "../types";

const { Paragraph, Text, Title } = Typography;

export default function BusinessEntityManagementPage() {
  const { entityId } = useParams();
  const [entity, setEntity] = useState<BusinessEntity | null>(null);
  const [fields, setFields] = useState<EntityField[]>([]);
  const [records, setRecords] = useState<EntityRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<EntityRecord | null>(null);
  const [isLoadingConfiguration, setIsLoadingConfiguration] = useState(
    Boolean(entityId),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadManagementData = async (businessEntityId: string) => {
    setError(null);
    setIsLoadingConfiguration(true);
    try {
      const [entityResponse, fieldsResponse, recordsResponse] =
        await Promise.all([
          getEntityById(businessEntityId),
          getFields(businessEntityId),
          getEntityRecords(businessEntityId),
        ]);
      setEntity(entityResponse);
      setFields(fieldsResponse);
      setRecords(recordsResponse);
    } catch {
      setError("No fue posible cargar los datos de la entidad seleccionada.");
    } finally {
      setIsLoadingConfiguration(false);
    }
  };

  const handleSaveRecord = async (values: EntityRecordPayload) => {
    if (!entityId) {
      return;
    }

    try {
      setError(null);
      setIsSaving(true);

      if (editingRecord) {
        await updateEntityRecord(entityId, editingRecord.id, values);
      } else {
        await createEntityRecord(entityId, values);
      }

      setEditingRecord(null);
      await loadManagementData(entityId);
    } catch {
      setError("No fue posible guardar el registro.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecord = async (record: EntityRecord) => {
    if (!entityId) {
      return;
    }

    try {
      setError(null);
      setIsDeleting(true);
      await deleteEntityRecord(entityId, record.id);

      if (editingRecord?.id === record.id) {
        setEditingRecord(null);
      }

      await loadManagementData(entityId);
    } catch {
      setError("No fue posible eliminar el registro.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!entityId) {
      return;
    }

    let isActive = true;

    Promise.all([
      getEntityById(entityId),
      getFields(entityId),
      getEntityRecords(entityId),
    ])
      .then(([entityResponse, fieldsResponse, recordsResponse]) => {
        if (isActive) {
          setEntity(entityResponse);
          setFields(fieldsResponse);
          setRecords(recordsResponse);
          setEditingRecord(null);
        }
      })
      .catch(() => {
        if (isActive) {
          setError(
            "No fue posible cargar los datos de la entidad seleccionada.",
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingConfiguration(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [entityId]);

  if (!entityId) {
    return (
      <section className="page-stack wide-page">
        <Card className="section-card">
          <Empty description="Selecciona una entidad generada desde el menú lateral." />
        </Card>
      </section>
    );
  }

  return (
    <section className="page-stack wide-page">
      <div className="page-heading">
        <Text type="secondary" strong>
          Gestión generada
        </Text>
        <Title level={2}>
          {entity?.name || "Gestión de entidad de negocio"}
        </Title>
        <Paragraph>
          Inserta, actualiza y elimina registros dinámicos para esta entidad de
          negocio a partir de la definición de sus campos.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <Card className="insight-card">
            <Statistic title="Campos disponibles" value={fields.length} />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card className="insight-card">
            <Statistic title="Registros almacenados" value={records.length} />
          </Card>
        </Col>
      </Row>

      {error && <Alert title={error} type="error" showIcon />}

      <Spin
        spinning={isLoadingConfiguration}
        description="Cargando campos y registros de la entidad..."
      >
        <div className="management-grid">
          <div>
            {fields.length === 0 ? (
              <Card className="section-card">
                <Empty description="Define campos para esta entidad antes de insertar registros." />
              </Card>
            ) : (
              <EntityRecordForm
                editingRecord={editingRecord}
                fields={fields}
                isSubmitting={isSaving}
                onCancelEdit={() => setEditingRecord(null)}
                onSubmit={handleSaveRecord}
              />
            )}
          </div>

          <Card
            className="section-card"
            title={`Registros de ${entity?.name || "la entidad"}`}
          >
            <EntityRecordsTable
              fields={fields}
              isDeleting={isDeleting}
              onDelete={handleDeleteRecord}
              onEdit={setEditingRecord}
              records={records}
            />
          </Card>
        </div>
      </Spin>
    </section>
  );
}
