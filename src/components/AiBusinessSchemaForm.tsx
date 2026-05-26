import SmartToyOutlined from "@mui/icons-material/SmartToyOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreOutlined from "@mui/icons-material/ExpandMoreOutlined";
import { type SubmitEvent, useEffect, useRef, useState } from "react";
import type {
  AiBusinessSchemaPlan,
  AiBusinessSchemaResponse,
  EntityField,
} from "../types";
import {
  FIELD_TYPE_LABELS,
  getValidationLabels,
  type FieldMetadata,
} from "../utils/fieldMetadata";

type AiBusinessSchemaFormProps = {
  executedSchema: AiBusinessSchemaResponse | null;
  generatedPlan: AiBusinessSchemaPlan | null;
  isExecuting: boolean;
  isGeneratingPlan: boolean;
  onAcceptPlan: () => Promise<void>;
  onGeneratePlan: (prompt: string) => Promise<void>;
  onRejectPlan: () => void;
};

function renderValidationTags(field: FieldMetadata) {
  return getValidationLabels(field).map((label) => (
    <Chip key={label} label={label} size="small" />
  ));
}

function renderAiRelationshipTarget(field: {
  referencedEntityName?: string | null;
  type: string;
}) {
  if (field.type !== "relationship" || !field.referencedEntityName) {
    return null;
  }

  return (
    <Chip
      label={`Destino ${field.referencedEntityName}`}
      size="small"
      variant="outlined"
    />
  );
}

function renderCreatedRelationshipTarget(
  field: EntityField,
  entityNamesById: Record<string, string>,
) {
  if (field.type !== "relationship" || !field.referencedBusinessEntityId) {
    return null;
  }

  return (
    <Chip
      label={`Destino ${
        entityNamesById[field.referencedBusinessEntityId] ??
        "Entidad no disponible"
      }`}
      size="small"
      variant="outlined"
    />
  );
}

export default function AiBusinessSchemaForm({
  executedSchema,
  generatedPlan,
  isExecuting,
  isGeneratingPlan,
  onAcceptPlan,
  onGeneratePlan,
  onRejectPlan,
}: AiBusinessSchemaFormProps) {
  const [prompt, setPrompt] = useState("");
  const generatedPlanRef = useRef<HTMLDivElement>(null);
  const executedSchemaRef = useRef<HTMLDivElement>(null);
  const createdEntityNamesById =
    executedSchema?.createdBusinessEntities.reduce<Record<string, string>>(
      (namesById, createdEntity) => {
        namesById[createdEntity.businessEntity.id] =
          createdEntity.businessEntity.name;
        return namesById;
      },
      {},
    ) ?? {};

  useEffect(() => {
    const target = generatedPlan
      ? generatedPlanRef.current
      : executedSchema
        ? executedSchemaRef.current
        : null;

    if (!target) {
      return;
    }

    const animationFrameId = window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [executedSchema, generatedPlan]);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onGeneratePlan(prompt.trim());
    setPrompt("");
  };

  return (
    <Card className="section-card">
      <CardHeader title="Crear entidades con agente generativo" />
      <CardContent>
        <Stack sx={{ gap: 2.5 }}>
          <Typography color="text.secondary">
            Describe en palabras simples qué información necesita gestionar tu
            negocio. El agente generativo propondrá entidades y campos, y el
            backend las creará automáticamente junto con las relaciones que
            hagan falta.
          </Typography>

          <Alert severity="info">
            Ejemplo: crea entidades para estudiantes y actividades. Los
            estudiantes necesitan nombre obligatorio, correo y activo. Las
            actividades necesitan título de máximo 120 caracteres, fecha de
            inicio desde 2026-01-01 y duración entre 1 y 8. Cada estudiante se
            relaciona con una actividad.
          </Alert>

          <Stack component="form" noValidate sx={{ gap: 2 }} onSubmit={submit}>
            <TextField
              multiline
              label="Descripción del modelo de negocio"
              minRows={4}
              placeholder="Ejemplo: Crea entidades para clientes y pedidos. Los clientes necesitan nombre, correo y activo. Los pedidos necesitan fecha, total y estado."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />

            <Box>
              <Button
                disabled={!prompt.trim() || isGeneratingPlan}
                startIcon={
                  isGeneratingPlan ? (
                    <CircularProgress size={16} />
                  ) : (
                    <SmartToyOutlined />
                  )
                }
                type="submit"
                variant="contained"
              >
                Generar plan
              </Button>
            </Box>
          </Stack>

          {generatedPlan && (
            <Box ref={generatedPlanRef} className="ai-schema-result">
              <Typography sx={{ fontWeight: 800 }}>
                Plan propuesto por el agente
              </Typography>
              <Typography color="text.secondary">
                Revisa esta propuesta antes de crear entidades reales. Si algo
                no corresponde con tu negocio, puedes rechazarla y escribir una
                descripción más precisa.
              </Typography>

              {generatedPlan.businessEntities.map((entityDefinition) => (
                <Accordion key={entityDefinition.name}>
                  <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                    <Typography sx={{ fontWeight: 800 }}>
                      {entityDefinition.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {entityDefinition.description}
                    </Typography>
                    <List disablePadding>
                      {(entityDefinition.fields ?? []).map((field) => (
                        <ListItem key={field.name} disableGutters>
                          <Stack
                            direction="row"
                            sx={{ flexWrap: "wrap", gap: 1 }}
                          >
                            <Typography sx={{ fontWeight: 800 }}>
                              {field.name}
                            </Typography>
                            <Chip
                              color="primary"
                              label={FIELD_TYPE_LABELS[field.type]}
                              size="small"
                              variant="outlined"
                            />
                            {renderAiRelationshipTarget(field)}
                            {renderValidationTags(field)}
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}

              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                <Button
                  disabled={isExecuting}
                  startIcon={
                    isExecuting ? <CircularProgress size={16} /> : null
                  }
                  variant="contained"
                  onClick={onAcceptPlan}
                >
                  Aceptar y crear entidades
                </Button>
                <Button
                  disabled={isExecuting}
                  variant="outlined"
                  onClick={onRejectPlan}
                >
                  Rechazar plan
                </Button>
              </Stack>
            </Box>
          )}

          {executedSchema && (
            <Box ref={executedSchemaRef} className="ai-schema-result">
              <Typography sx={{ fontWeight: 800 }}>
                Resultado creado por el agente
              </Typography>
              {executedSchema.createdBusinessEntities.map((createdEntity) => (
                <Accordion key={createdEntity.businessEntity.id}>
                  <AccordionSummary expandIcon={<ExpandMoreOutlined />}>
                    <Typography sx={{ fontWeight: 800 }}>
                      {createdEntity.businessEntity.name}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List disablePadding>
                      {createdEntity.fields.map((field) => (
                        <ListItem key={field.id} disableGutters>
                          <Stack
                            direction="row"
                            sx={{ flexWrap: "wrap", gap: 1 }}
                          >
                            <Typography sx={{ fontWeight: 800 }}>
                              {field.name}
                            </Typography>
                            <Chip
                              color="primary"
                              label={FIELD_TYPE_LABELS[field.type]}
                              size="small"
                              variant="outlined"
                            />
                            {renderCreatedRelationshipTarget(
                              field,
                              createdEntityNamesById,
                            )}
                            {renderValidationTags(field)}
                          </Stack>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
