import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { type FormEvent, useEffect, useState } from "react";
import type { EntityField, EntityRecord, EntityRecordPayload } from "../types";
import { validateRecordValues } from "../utils/formValidation";
import {
  getInitialRecordFieldValue,
  normalizeRecordValues,
  type RecordFormValues,
} from "../utils/recordValues";
import {
  getFieldError,
  groupValidationErrors,
} from "../utils/validationErrors";

type EntityRecordFormProps = {
  editingRecord: EntityRecord | null;
  fields: EntityField[];
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (values: EntityRecordPayload) => Promise<void>;
};

function buildInitialValues(
  fields: EntityField[],
  record: EntityRecord | null,
) {
  return fields.reduce<RecordFormValues>((values, field) => {
    values[field.name] = getInitialRecordFieldValue(field, record);
    return values;
  }, {});
}

function getTextFieldValue(value: RecordFormValues[string]) {
  return typeof value === "string" || typeof value === "number" ? value : "";
}

function parseNumberValue(value: string) {
  return value === "" ? undefined : Number(value);
}

export default function EntityRecordForm({
  editingRecord,
  fields,
  isSubmitting,
  onCancelEdit,
  onSubmit,
}: EntityRecordFormProps) {
  const [values, setValues] = useState<RecordFormValues>({});
  const [errorsByField, setErrorsByField] = useState<Record<string, string[]>>(
    {},
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const initialValues = buildInitialValues(fields, editingRecord);
    const validationErrors = validateRecordValues(
      fields,
      normalizeRecordValues(fields, initialValues),
    );
    const timeoutId = window.setTimeout(() => {
      setValues(initialValues);
      setErrorsByField({});
      setIsFormValid(validationErrors.length === 0);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [editingRecord, fields]);

  const syncValidationErrors = (nextValues: RecordFormValues) => {
    const recordValues = normalizeRecordValues(fields, nextValues);
    const validationErrors = validateRecordValues(fields, recordValues);

    setErrorsByField(groupValidationErrors(validationErrors));
    setIsFormValid(validationErrors.length === 0);

    return validationErrors;
  };

  const updateField = (fieldName: string, value: RecordFormValues[string]) => {
    const nextValues = { ...values, [fieldName]: value };
    setValues(nextValues);
    syncValidationErrors(nextValues);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = syncValidationErrors(values);

    if (validationErrors.length > 0) {
      return;
    }

    await onSubmit(normalizeRecordValues(fields, values));
    const initialValues = buildInitialValues(fields, null);
    setValues(initialValues);
    setErrorsByField({});
    setIsFormValid(false);
  };

  return (
    <Card className="section-card">
      <CardHeader
        title={editingRecord ? "Actualizar registro" : "Crear registro"}
      />
      <CardContent>
        <Stack component="form" noValidate sx={{ gap: 2 }} onSubmit={submit}>
          {fields.map((field) => {
            const fieldError = getFieldError(errorsByField, field.name);
            const value = values[field.name];

            if (field.type === "boolean") {
              return (
                <FormControlLabel
                  key={field.id}
                  control={
                    <Switch
                      checked={Boolean(value)}
                      onChange={(event) =>
                        updateField(field.name, event.target.checked)
                      }
                    />
                  }
                  label={field.name}
                />
              );
            }

            if (field.type === "number") {
              return (
                <TextField
                  key={field.id}
                  error={Boolean(fieldError)}
                  helperText={fieldError}
                  label={field.name}
                  type="number"
                  value={getTextFieldValue(value)}
                  slotProps={{
                    htmlInput: {
                      max: field.maxValue ?? undefined,
                      min: field.minValue ?? undefined,
                    },
                  }}
                  onChange={(event) =>
                    updateField(
                      field.name,
                      parseNumberValue(event.target.value),
                    )
                  }
                />
              );
            }

            if (field.type === "date") {
              return (
                <TextField
                  key={field.id}
                  error={Boolean(fieldError)}
                  helperText={fieldError}
                  label={field.name}
                  type="date"
                  value={getTextFieldValue(value)}
                  slotProps={{
                    htmlInput: {
                      max: field.maxDate ?? undefined,
                      min: field.minDate ?? undefined,
                    },
                    inputLabel: { shrink: true },
                  }}
                  onChange={(event) =>
                    updateField(field.name, event.target.value)
                  }
                />
              );
            }

            return (
              <TextField
                key={field.id}
                error={Boolean(fieldError)}
                helperText={fieldError}
                label={field.name}
                value={getTextFieldValue(value)}
                slotProps={{
                  htmlInput: {
                    maxLength: field.maxLength ?? undefined,
                  },
                }}
                onChange={(event) =>
                  updateField(field.name, event.target.value)
                }
              />
            );
          })}

          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            <Button
              disabled={!isFormValid || isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
              type="submit"
              variant="contained"
            >
              {editingRecord ? "Actualizar" : "Crear"}
            </Button>
            {editingRecord && (
              <Button variant="outlined" onClick={onCancelEdit}>
                Cancelar
              </Button>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
