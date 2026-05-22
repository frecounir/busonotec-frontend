import AddOutlined from "@mui/icons-material/AddOutlined";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { type FormEvent, useState } from "react";
import type { CreateFieldInput } from "../types";
import { FIELD_TYPE_LABELS, FIELD_TYPES } from "../utils/fieldMetadata";
import { validateFieldDefinition } from "../utils/formValidation";
import {
  normalizeFieldValues,
  type FieldFormValues,
} from "../utils/formNormalizers";
import {
  getFieldError,
  groupValidationErrors,
} from "../utils/validationErrors";

type FieldFormProps = {
  isSubmitting: boolean;
  onCreate: (data: Omit<CreateFieldInput, "businessEntityId">) => Promise<void>;
};

const initialValues: FieldFormValues = {
  name: "",
  required: false,
  type: "string",
};

function getOptionalNumberValue(value: number | null | undefined) {
  return typeof value === "number" ? value : "";
}

function parseOptionalNumber(value: string) {
  return value === "" ? undefined : Number(value);
}

export default function FieldForm({ isSubmitting, onCreate }: FieldFormProps) {
  const [values, setValues] = useState<FieldFormValues>(initialValues);
  const [errorsByField, setErrorsByField] = useState<Record<string, string[]>>(
    {},
  );
  const [isFormValid, setIsFormValid] = useState(false);

  const syncValidationErrors = (nextValues: FieldFormValues) => {
    const fieldValues = normalizeFieldValues(nextValues);
    const validationErrors = validateFieldDefinition(fieldValues);

    setErrorsByField(groupValidationErrors(validationErrors));
    setIsFormValid(validationErrors.length === 0);

    return validationErrors;
  };

  const updateValues = (nextValues: FieldFormValues) => {
    setValues(nextValues);
    syncValidationErrors(nextValues);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fieldValues = normalizeFieldValues(values);
    const validationErrors = syncValidationErrors(values);

    if (validationErrors.length > 0) {
      return;
    }

    await onCreate(fieldValues);
    setValues(initialValues);
    setErrorsByField({});
    setIsFormValid(false);
  };

  return (
    <Card className="section-card">
      <CardHeader title="Agregar campo" />
      <CardContent>
        <Stack component="form" noValidate sx={{ gap: 2 }} onSubmit={submit}>
          <div className="field-base-grid">
            <TextField
              error={Boolean(getFieldError(errorsByField, "name"))}
              helperText={getFieldError(errorsByField, "name")}
              label="Nombre"
              placeholder="correo_electronico"
              value={values.name}
              onChange={(event) =>
                updateValues({ ...values, name: event.target.value })
              }
            />

            <TextField
              select
              error={Boolean(getFieldError(errorsByField, "type"))}
              helperText={getFieldError(errorsByField, "type")}
              label="Tipo"
              value={values.type}
              onChange={(event) =>
                updateValues({
                  name: values.name,
                  required: values.required,
                  type: event.target.value as FieldFormValues["type"],
                })
              }
            >
              {FIELD_TYPES.map((fieldType) => (
                <MenuItem key={fieldType} value={fieldType}>
                  {FIELD_TYPE_LABELS[fieldType]}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(values.required)}
                  onChange={(event) =>
                    updateValues({
                      ...values,
                      required: event.target.checked,
                    })
                  }
                />
              }
              label="Obligatorio"
            />

            <Button
              disabled={!isFormValid || isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={16} /> : <AddOutlined />
              }
              type="submit"
              variant="contained"
            >
              Agregar campo
            </Button>
          </div>

          {values.type === "string" && (
            <div className="field-validation-grid">
              <TextField
                error={Boolean(getFieldError(errorsByField, "minLength"))}
                helperText={getFieldError(errorsByField, "minLength")}
                label="Longitud mínima"
                type="number"
                value={getOptionalNumberValue(values.minLength)}
                onChange={(event) =>
                  updateValues({
                    ...values,
                    minLength: parseOptionalNumber(event.target.value),
                  })
                }
              />
              <TextField
                error={Boolean(getFieldError(errorsByField, "maxLength"))}
                helperText={getFieldError(errorsByField, "maxLength")}
                label="Longitud máxima"
                type="number"
                value={getOptionalNumberValue(values.maxLength)}
                onChange={(event) =>
                  updateValues({
                    ...values,
                    maxLength: parseOptionalNumber(event.target.value),
                  })
                }
              />
            </div>
          )}

          {values.type === "number" && (
            <div className="field-validation-grid">
              <TextField
                error={Boolean(getFieldError(errorsByField, "minValue"))}
                helperText={getFieldError(errorsByField, "minValue")}
                label="Valor mínimo"
                type="number"
                value={getOptionalNumberValue(values.minValue)}
                onChange={(event) =>
                  updateValues({
                    ...values,
                    minValue: parseOptionalNumber(event.target.value),
                  })
                }
              />
              <TextField
                error={Boolean(getFieldError(errorsByField, "maxValue"))}
                helperText={getFieldError(errorsByField, "maxValue")}
                label="Valor máximo"
                type="number"
                value={getOptionalNumberValue(values.maxValue)}
                onChange={(event) =>
                  updateValues({
                    ...values,
                    maxValue: parseOptionalNumber(event.target.value),
                  })
                }
              />
            </div>
          )}

          {values.type === "date" && (
            <div className="field-validation-grid">
              <TextField
                error={Boolean(getFieldError(errorsByField, "minDate"))}
                helperText={getFieldError(errorsByField, "minDate")}
                label="Fecha mínima"
                type="date"
                value={values.minDate ?? ""}
                slotProps={{ inputLabel: { shrink: true } }}
                onChange={(event) =>
                  updateValues({ ...values, minDate: event.target.value })
                }
              />
              <TextField
                error={Boolean(getFieldError(errorsByField, "maxDate"))}
                helperText={getFieldError(errorsByField, "maxDate")}
                label="Fecha máxima"
                type="date"
                value={values.maxDate ?? ""}
                slotProps={{ inputLabel: { shrink: true } }}
                onChange={(event) =>
                  updateValues({ ...values, maxDate: event.target.value })
                }
              />
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
