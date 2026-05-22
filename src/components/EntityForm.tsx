import AddOutlined from "@mui/icons-material/AddOutlined";
import SmartToyOutlined from "@mui/icons-material/SmartToyOutlined";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Stack,
  TextField,
} from "@mui/material";
import { type FormEvent, type RefObject, useState } from "react";
import type { CreateEntityInput } from "../types";
import { validateBusinessEntityDefinition } from "../utils/formValidation";
import { normalizeEntityValues } from "../utils/formNormalizers";
import {
  getFieldError,
  groupValidationErrors,
} from "../utils/validationErrors";

type EntityFormProps = {
  aiToggleButtonRef?: RefObject<HTMLButtonElement | null>;
  isAiSectionVisible: boolean;
  isSubmitting: boolean;
  onCreate: (data: CreateEntityInput) => Promise<void>;
  onToggleAiSection: () => void;
};

const initialValues: CreateEntityInput = {
  description: "",
  name: "",
};

export default function EntityForm({
  aiToggleButtonRef,
  isAiSectionVisible,
  isSubmitting,
  onCreate,
  onToggleAiSection,
}: EntityFormProps) {
  const [values, setValues] = useState<CreateEntityInput>(initialValues);
  const [errorsByField, setErrorsByField] = useState<Record<string, string[]>>(
    {},
  );
  const [isFormValid, setIsFormValid] = useState(false);

  const syncValidationErrors = (nextValues: CreateEntityInput) => {
    const entityValues = normalizeEntityValues(nextValues);
    const validationErrors = validateBusinessEntityDefinition(entityValues);

    setErrorsByField(groupValidationErrors(validationErrors));
    setIsFormValid(validationErrors.length === 0);

    return validationErrors;
  };

  const updateField = (fieldName: keyof CreateEntityInput, value: string) => {
    const nextValues = { ...values, [fieldName]: value };
    setValues(nextValues);
    syncValidationErrors(nextValues);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entityValues = normalizeEntityValues(values);
    const validationErrors = syncValidationErrors(values);

    if (validationErrors.length > 0) {
      return;
    }

    await onCreate(entityValues);
    setValues(initialValues);
    setErrorsByField({});
    setIsFormValid(false);
  };

  return (
    <Card className="section-card">
      <CardHeader
        title="Crear entidad de negocio"
        action={
          <Button
            ref={aiToggleButtonRef}
            startIcon={<SmartToyOutlined />}
            variant="outlined"
            onClick={onToggleAiSection}
          >
            {isAiSectionVisible
              ? "Ocultar agente generativo"
              : "Usar agente generativo"}
          </Button>
        }
      />
      <CardContent>
        <Stack
          component="form"
          className="form-grid"
          noValidate
          onSubmit={submit}
        >
          <TextField
            error={Boolean(getFieldError(errorsByField, "name"))}
            helperText={getFieldError(errorsByField, "name")}
            label="Nombre"
            placeholder="Cliente"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
          />

          <TextField
            error={Boolean(getFieldError(errorsByField, "description"))}
            helperText={getFieldError(errorsByField, "description")}
            label="Descripción"
            placeholder="Representa un cliente del negocio"
            value={values.description ?? ""}
            onChange={(event) => updateField("description", event.target.value)}
          />

          <Button
            disabled={!isFormValid || isSubmitting}
            startIcon={
              isSubmitting ? <CircularProgress size={16} /> : <AddOutlined />
            }
            type="submit"
            variant="contained"
          >
            Crear entidad
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
