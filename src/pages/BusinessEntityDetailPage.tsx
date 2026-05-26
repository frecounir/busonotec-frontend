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
import FieldForm from "../components/FieldForm";
import FieldsTable from "../components/FieldsTable";
import LoadingPanel from "../components/LoadingPanel";
import MetricCard from "../components/MetricCard";
import PageGuide, { type GuideStep } from "../components/PageGuide";
import { getBusinessEntityConfiguration } from "../services/businessEntityConfigurationService";
import { getEntities } from "../services/entityService";
import { createField, deleteField } from "../services/fieldService";
import type { BusinessEntity, CreateFieldInput, EntityField } from "../types";

export default function BusinessEntityDetailPage() {
  const { id } = useParams();
  const [entity, setEntity] = useState<BusinessEntity | null>(null);
  const [businessEntities, setBusinessEntities] = useState<BusinessEntity[]>(
    [],
  );
  const [fields, setFields] = useState<EntityField[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const steps: GuideStep[] = [
    {
      title: "Revisa la entidad",
      description:
        "Aquí se muestra la entidad que estás configurando. Piensa en ella como una carpeta o categoría principal donde se guardará información del negocio. La descripción ayuda a que otras personas entiendan para qué existe.",
      target: () => summaryRef.current,
    },
    {
      title: "Mide la configuración",
      description:
        "Estos indicadores muestran cuántos datos se han definido para la entidad. Mientras más campos agregues, más completa será la información que se podrá registrar después en la pantalla generada.",
      target: () => statsRef.current,
    },
    {
      title: "Agrega campos dinámicos",
      description:
        "Un campo es un dato específico que quieres guardar. Por ejemplo, para Estudiantes podrías crear nombre como Texto, puntaje como Número, fecha_ingreso como Fecha y activo como Verdadero/Falso. También puedes definir si es obligatorio y agregar reglas simples como longitudes, rangos numéricos o fechas permitidas.",
      target: () => formRef.current,
    },
    {
      title: "Valida la estructura",
      description:
        "Esta tabla funciona como una vista previa de la estructura de la entidad. Si aquí aparecen los campos correctos, la pantalla generada de gestión podrá pedir y mostrar la información adecuada para cada registro. También puedes eliminar un campo si ya no debe formar parte de la información que se guarda.",
      target: () => tableRef.current,
    },
  ];

  const load = async () => {
    if (!id) {
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const [configuration, entities] = await Promise.all([
        getBusinessEntityConfiguration(id),
        getEntities(),
      ]);
      setEntity(configuration.entity);
      setFields(configuration.fields);
      setBusinessEntities(entities);
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

  const handleDeleteField = async (field: EntityField) => {
    try {
      setError(null);
      setIsDeleting(true);
      await deleteField(field.id);
      await load();
    } catch {
      setError("No fue posible eliminar el campo.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    let isActive = true;

    Promise.all([getBusinessEntityConfiguration(id), getEntities()])
      .then(([configuration, entities]) => {
        if (isActive) {
          setEntity(configuration.entity);
          setFields(configuration.fields);
          setBusinessEntities(entities);
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
      {error && <Alert severity="error">{error}</Alert>}

      {isLoading ? (
        <LoadingPanel label="Cargando configuración de la entidad..." />
      ) : (
        <>
          <Box ref={summaryRef}>
            <Card className="page-card">
              <CardContent>
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
                      Entidad de negocio
                    </Typography>
                    <Typography variant="h2">
                      {entity?.name || "Detalle de la entidad"}
                    </Typography>
                  </Box>
                  <PageGuide steps={steps} />
                </Stack>
                <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                  {entity?.description ||
                    "No se ha definido una descripción para esta entidad."}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box ref={statsRef} className="stats-grid two-columns">
            <MetricCard label="Campos definidos" value={fields.length} />
            <MetricCard
              label="Módulo generado"
              value={entity ? "Listo" : "Pendiente"}
            />
          </Box>

          <Box ref={formRef}>
            <FieldForm
              businessEntities={businessEntities}
              isSubmitting={isCreating}
              onCreate={handleCreateField}
            />
          </Box>

          <Box ref={tableRef}>
            <Card className="section-card">
              <CardHeader title="Campos definidos" />
              <CardContent>
                <FieldsTable
                  businessEntities={businessEntities}
                  fields={fields}
                  isDeleting={isDeleting}
                  onDelete={handleDeleteField}
                />
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </section>
  );
}
