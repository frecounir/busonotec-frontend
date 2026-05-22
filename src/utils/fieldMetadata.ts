import type { EntityFieldType, EntityFieldValidation } from "../types";

export type FieldMetadata = {
  type: EntityFieldType;
} & EntityFieldValidation;

export const FIELD_TYPES: EntityFieldType[] = [
  "string",
  "number",
  "boolean",
  "date",
];

export const FIELD_TYPE_LABELS: Record<EntityFieldType, string> = {
  boolean: "Verdadero/Falso",
  date: "Fecha",
  number: "Número",
  string: "Texto",
};

function hasNumberValidation(
  value: number | null | undefined,
): value is number {
  return typeof value === "number";
}

export function getValidationLabels(field: FieldMetadata) {
  const labels: string[] = [];

  if (field.required) {
    labels.push("Obligatorio");
  }

  if (field.type === "string") {
    if (hasNumberValidation(field.minLength)) {
      labels.push(`Mínimo ${field.minLength} caracteres`);
    }

    if (hasNumberValidation(field.maxLength)) {
      labels.push(`Máximo ${field.maxLength} caracteres`);
    }
  }

  if (field.type === "number") {
    if (hasNumberValidation(field.minValue)) {
      labels.push(`Mínimo ${field.minValue}`);
    }

    if (hasNumberValidation(field.maxValue)) {
      labels.push(`Máximo ${field.maxValue}`);
    }
  }

  if (field.type === "date") {
    if (field.minDate) {
      labels.push(`Desde ${field.minDate}`);
    }

    if (field.maxDate) {
      labels.push(`Hasta ${field.maxDate}`);
    }
  }

  return labels;
}
