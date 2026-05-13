import {
  Alert,
  Card,
  Col,
  Empty,
  Flex,
  Row,
  Spin,
  Statistic,
  Typography,
} from "antd";
import type { TourProps } from "antd";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EntityRecordForm from "../components/EntityRecordForm";
import EntityRecordsTable from "../components/EntityRecordsTable";
import PageGuide from "../components/PageGuide";
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
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const steps: TourProps["steps"] = [
    {
      title: "Gestiona datos reales",
      description:
        "Esta pantalla es el resultado de la configuración previa. Aquí el usuario ya no define la estructura; ahora trabaja con datos reales. Por ejemplo, si la entidad es Estudiantes, aquí podrá registrar estudiantes concretos.",
      target: () => headingRef.current as HTMLElement,
    },
    {
      title: "Entiende el estado del módulo",
      description:
        "Estos indicadores explican el estado de la pantalla generada: cuántos campos forman el formulario y cuántos registros se han guardado. Esto ayuda a comprobar si la entidad ya está lista para ser usada por el negocio.",
      target: () => statsRef.current as HTMLElement,
    },
    {
      title: "Inserta o actualiza información",
      description:
        "El formulario cambia según los campos que se configuraron antes. Si se creó un campo puntaje, aparecerá para diligenciarlo. Si se creó activo, aparecerá como una opción de sí o no. Así, cada entidad tiene su propio formulario sin construirlo manualmente.",
      target: () => formRef.current as HTMLElement,
    },
    {
      title: "Administra registros",
      description:
        "La tabla muestra la información ya guardada. Desde aquí se puede actualizar una fila, por ejemplo corregir el correo de un estudiante, o eliminar un registro cuando ya no sea necesario conservarlo.",
      target: () => tableRef.current as HTMLElement,
    },
  ];

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
      <div ref={headingRef} className="page-heading">
        <Flex align="flex-start" gap={16} justify="space-between" wrap>
          <div>
            <Text type="secondary" strong>
              Gestión generada
            </Text>
            <Title level={2}>
              {entity?.name || "Gestión de entidad de negocio"}
            </Title>
          </div>
          <PageGuide steps={steps} />
        </Flex>
        <Paragraph>
          Inserta, actualiza y elimina registros dinámicos para esta entidad de
          negocio a partir de la definición de sus campos.
        </Paragraph>
      </div>

      <div ref={statsRef}>
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
      </div>

      {error && <Alert title={error} type="error" showIcon />}

      <Spin
        spinning={isLoadingConfiguration}
        description="Cargando campos y registros de la entidad..."
      >
        <div className="management-grid">
          <div ref={formRef}>
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

          <div ref={tableRef}>
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
        </div>
      </Spin>
    </section>
  );
}
