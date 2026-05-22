import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import EntityRecordForm from "../components/EntityRecordForm";
import EntityRecordsTable from "../components/EntityRecordsTable";
import LoadingPanel from "../components/LoadingPanel";
import MetricCard from "../components/MetricCard";
import PageGuide, { type GuideStep } from "../components/PageGuide";
import { getBusinessEntityManagementData } from "../services/businessEntityConfigurationService";
import {
  createEntityRecord,
  deleteEntityRecord,
  updateEntityRecord,
} from "../services/entityRecordService";
import type {
  BusinessEntity,
  EntityField,
  EntityRecord,
  EntityRecordPayload,
} from "../types";

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
  const steps: GuideStep[] = [
    {
      title: "Gestiona datos reales",
      description:
        "Esta pantalla es el resultado de la configuración previa. Aquí el usuario ya no define la estructura; ahora trabaja con datos reales. Por ejemplo, si la entidad es Estudiantes, aquí podrá registrar estudiantes concretos.",
      target: () => headingRef.current,
    },
    {
      title: "Entiende el estado del módulo",
      description:
        "Estos indicadores explican el estado de la pantalla generada: cuántos campos forman el formulario y cuántos registros se han guardado. Esto ayuda a comprobar si la entidad ya está lista para ser usada por el negocio.",
      target: () => statsRef.current,
    },
    {
      title: "Inserta o actualiza información",
      description:
        "El formulario cambia según los campos que se configuraron antes. Si se creó un campo puntaje, aparecerá para diligenciarlo. Si se creó activo, aparecerá como una opción de sí o no. Así, cada entidad tiene su propio formulario sin construirlo manualmente.",
      target: () => formRef.current,
    },
    {
      title: "Administra registros",
      description:
        "La tabla muestra la información ya guardada. Desde aquí se puede actualizar una fila, por ejemplo corregir el correo de un estudiante, o eliminar un registro cuando ya no sea necesario conservarlo.",
      target: () => tableRef.current,
    },
  ];

  const loadManagementData = async (businessEntityId: string) => {
    setError(null);
    setIsLoadingConfiguration(true);
    try {
      const managementData =
        await getBusinessEntityManagementData(businessEntityId);
      setEntity(managementData.entity);
      setFields(managementData.fields);
      setRecords(managementData.records);
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

    getBusinessEntityManagementData(entityId)
      .then((managementData) => {
        if (isActive) {
          setEntity(managementData.entity);
          setFields(managementData.fields);
          setRecords(managementData.records);
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
          <CardContent>
            <EmptyState description="Selecciona una entidad generada desde el menú lateral." />
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="page-stack wide-page">
      <Box ref={headingRef} className="page-heading">
        <Stack
          direction="row"
          sx={{
            alignItems: "flex-start",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography color="text.secondary" sx={{ fontWeight: 800 }}>
              Gestión generada
            </Typography>
            <Typography variant="h2">
              {entity?.name || "Gestión de entidad de negocio"}
            </Typography>
          </Box>
          <PageGuide steps={steps} />
        </Stack>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Inserta, actualiza y elimina registros dinámicos para esta entidad de
          negocio a partir de la definición de sus campos.
        </Typography>
      </Box>

      <Box ref={statsRef} className="stats-grid two-columns">
        <MetricCard label="Campos disponibles" value={fields.length} />
        <MetricCard label="Registros almacenados" value={records.length} />
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {isLoadingConfiguration ? (
        <LoadingPanel label="Cargando campos y registros de la entidad..." />
      ) : (
        <Box className="management-grid">
          <Box ref={formRef}>
            {fields.length === 0 ? (
              <Card className="section-card">
                <CardContent>
                  <EmptyState description="Define campos para esta entidad antes de insertar registros." />
                </CardContent>
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
          </Box>

          <Box ref={tableRef}>
            <Card className="section-card">
              <CardHeader
                title={`Registros de ${entity?.name || "la entidad"}`}
              />
              <CardContent>
                <EntityRecordsTable
                  fields={fields}
                  isDeleting={isDeleting}
                  onDelete={handleDeleteRecord}
                  onEdit={setEditingRecord}
                  records={records}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </section>
  );
}
