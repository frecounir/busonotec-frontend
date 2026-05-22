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
import {
  createBusinessSchemaPlan,
  executeBusinessSchemaPlan,
} from "../services/aiBusinessSchemaService";
import {
  createEntity,
  deleteEntity,
  getEntities,
} from "../services/entityService";
import AiBusinessSchemaForm from "../components/AiBusinessSchemaForm";
import EntitiesTable from "../components/EntitiesTable";
import EntityForm from "../components/EntityForm";
import LoadingPanel from "../components/LoadingPanel";
import MetricCard from "../components/MetricCard";
import PageGuide, { type GuideStep } from "../components/PageGuide";
import type {
  AiBusinessSchemaPlan,
  AiBusinessSchemaResponse,
  BusinessEntity,
  CreateEntityInput,
} from "../types";
import { notifyBusinessEntitiesChanged } from "../utils/businessEntityEvents";

export default function BusinessEntitiesPage() {
  const [entities, setEntities] = useState<BusinessEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isExecutingPlan, setIsExecutingPlan] = useState(false);
  const [isAiSectionVisible, setIsAiSectionVisible] = useState(false);
  const [deletingEntityId, setDeletingEntityId] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] =
    useState<AiBusinessSchemaPlan | null>(null);
  const [executedSchema, setExecutedSchema] =
    useState<AiBusinessSchemaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const aiFormRef = useRef<HTMLDivElement>(null);
  const aiToggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const steps: GuideStep[] = [
    {
      title: "Define entidades de negocio",
      description:
        "Una entidad de negocio es algo importante para la organización y sobre lo cual se necesita guardar información. Puede ser Estudiantes, Clientes, Cursos, Productos, Solicitudes o cualquier concepto propio del proceso que se quiere gestionar.",
      target: () => headingRef.current,
    },
    {
      title: "Observa el avance de configuración",
      description:
        "Estos números ayudan a entender cuánto se ha configurado hasta el momento. Cada entidad creada se convierte en una opción del menú lateral, lo que significa que el sistema empieza a construir secciones de trabajo a partir de lo definido por el usuario.",
      target: () => statsRef.current,
    },
    {
      title: "Usa el agente generativo",
      description:
        "Al presionarlo se abre una sección opcional para describir el proceso en lenguaje natural y crear varias entidades con sus campos automáticamente.",
      target: () => aiToggleButtonRef.current,
    },
    {
      title: "Crea una entidad manualmente",
      description:
        "Para crear una entidad, escribe un nombre claro y una descripción breve. Por ejemplo: nombre Estudiantes y descripción Personas inscritas en actividades académicas. No hace falta saber de programación; basta con describir el concepto del negocio.",
      target: () => formRef.current,
    },
    {
      title: "Administra la entidad",
      description:
        "La tabla muestra las entidades ya creadas. El botón Gestionar permite definir qué datos tendrá esa entidad. El botón Eliminar debe usarse con cuidado, porque elimina la entidad, sus campos y la información técnica asociada.",
      target: () => tableRef.current,
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
      notifyBusinessEntitiesChanged();
      await load();
    } catch {
      setError("No fue posible crear la entidad de negocio.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleGeneratePlan = async (prompt: string) => {
    try {
      setError(null);
      setExecutedSchema(null);
      setIsGeneratingPlan(true);
      const planResponse = await createBusinessSchemaPlan({ prompt });
      setGeneratedPlan(planResponse);
    } catch {
      setError("No fue posible generar el plan con el agente generativo.");
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleAcceptPlan = async () => {
    if (!generatedPlan) {
      return;
    }

    try {
      setError(null);
      setIsExecutingPlan(true);
      const executionResponse = await executeBusinessSchemaPlan(generatedPlan);
      setExecutedSchema(executionResponse);
      setGeneratedPlan(null);
      notifyBusinessEntitiesChanged();
      await load();
    } catch {
      setError("No fue posible ejecutar el plan del agente generativo.");
    } finally {
      setIsExecutingPlan(false);
    }
  };

  const handleRejectPlan = () => {
    setGeneratedPlan(null);
    setExecutedSchema(null);
  };

  const handleDelete = async (entity: BusinessEntity) => {
    try {
      setError(null);
      setDeletingEntityId(entity.id);
      await deleteEntity(entity.id);
      notifyBusinessEntitiesChanged();
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
              Configuración
            </Typography>
            <Typography variant="h2">Entidades de negocio</Typography>
          </Box>
          <PageGuide steps={steps} />
        </Stack>
      </Box>

      <Box ref={statsRef} className="stats-grid two-columns">
        <MetricCard label="Entidades configuradas" value={entities.length} />
        <MetricCard label="Opciones generadas" value={entities.length} />
      </Box>

      <Box ref={formRef}>
        <EntityForm
          aiToggleButtonRef={aiToggleButtonRef}
          isAiSectionVisible={isAiSectionVisible}
          isSubmitting={isCreating}
          onCreate={handleCreate}
          onToggleAiSection={() =>
            setIsAiSectionVisible((currentValue) => !currentValue)
          }
        />
      </Box>

      {isAiSectionVisible && (
        <Box ref={aiFormRef}>
          <AiBusinessSchemaForm
            executedSchema={executedSchema}
            generatedPlan={generatedPlan}
            isExecuting={isExecutingPlan}
            isGeneratingPlan={isGeneratingPlan}
            onAcceptPlan={handleAcceptPlan}
            onGeneratePlan={handleGeneratePlan}
            onRejectPlan={handleRejectPlan}
          />
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Box ref={tableRef}>
        <Card className="section-card">
          <CardHeader title="Entidades configuradas" />
          <CardContent>
            {isLoading ? (
              <LoadingPanel label="Cargando entidades de negocio..." />
            ) : (
              <EntitiesTable
                deletingEntityId={deletingEntityId}
                entities={entities}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </Box>
    </section>
  );
}
