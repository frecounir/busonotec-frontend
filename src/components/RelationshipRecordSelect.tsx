import { MenuItem, TextField } from "@mui/material";
import type { RelationshipRecordOptions } from "../services/businessEntityConfigurationService";
import type { EntityField } from "../types";
import { getRecordDisplayLabel } from "../utils/recordValues";

type RelationshipRecordSelectProps = {
  error?: string;
  field: EntityField;
  options?: RelationshipRecordOptions;
  unavailableRecordIds?: Set<string>;
  value: string;
  onChange: (value: string) => void;
};

export default function RelationshipRecordSelect({
  error,
  field,
  options,
  unavailableRecordIds = new Set<string>(),
  value,
  onChange,
}: RelationshipRecordSelectProps) {
  const records = options?.records ?? [];
  const targetFields = options?.fields ?? [];
  const selectedRecordExists = records.some((record) => record.id === value);
  const helperText =
    error ??
    (options
      ? `Selecciona un registro de ${options.entity.name}.`
      : "No se pudo cargar la entidad relacionada.");

  return (
    <TextField
      select
      error={Boolean(error)}
      helperText={helperText}
      label={field.name}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <MenuItem disabled={field.required} value="">
        {field.required ? "Selecciona un registro" : "Sin relación"}
      </MenuItem>
      {value && !selectedRecordExists && (
        <MenuItem value={value}>Registro relacionado no disponible</MenuItem>
      )}
      {records.map((record) => {
        const isUnavailable = unavailableRecordIds.has(record.id);
        const label = getRecordDisplayLabel(record, targetFields);

        return (
          <MenuItem key={record.id} disabled={isUnavailable} value={record.id}>
            {isUnavailable ? `${label} (ya relacionado)` : label}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
