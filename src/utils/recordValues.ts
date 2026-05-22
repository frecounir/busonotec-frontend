import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { EntityField, EntityRecord, EntityRecordPayload } from "../types";

export type RecordFormValues = Record<
  string,
  string | number | boolean | Dayjs | null | undefined
>;

type EntityRecordWithOptionalValues = EntityRecord & {
  values?: Record<string, unknown>;
};

function normalizeRecordKey(key: string) {
  return key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_-]/g, "")
    .toLowerCase();
}

function findValueByFieldName(
  source: Record<string, unknown>,
  fieldName: string,
) {
  if (Object.prototype.hasOwnProperty.call(source, fieldName)) {
    return source[fieldName];
  }

  const caseInsensitiveKey = Object.keys(source).find(
    (key) => key.toLowerCase() === fieldName.toLowerCase(),
  );

  if (caseInsensitiveKey) {
    return source[caseInsensitiveKey];
  }

  const normalizedFieldName = normalizeRecordKey(fieldName);
  const normalizedKey = Object.keys(source).find(
    (key) => normalizeRecordKey(key) === normalizedFieldName,
  );

  return normalizedKey ? source[normalizedKey] : undefined;
}

export function getRecordFieldValue(
  record: EntityRecord | null,
  fieldName: string,
) {
  if (!record) {
    return undefined;
  }

  const recordSource = record as Record<string, unknown>;
  const value = findValueByFieldName(recordSource, fieldName);

  if (value !== undefined) {
    return value;
  }

  const nestedValues = (record as EntityRecordWithOptionalValues).values;

  if (nestedValues && typeof nestedValues === "object") {
    return findValueByFieldName(nestedValues, fieldName);
  }

  return undefined;
}

export function getInitialRecordFieldValue(
  field: EntityField,
  record: EntityRecord | null,
) {
  const value = getRecordFieldValue(record, field.name);

  if (field.type === "date" && typeof value === "string") {
    return value;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return field.type === "boolean" ? false : undefined;
}

export function normalizeRecordValues(
  fields: EntityField[],
  values: RecordFormValues,
): EntityRecordPayload {
  return fields.reduce<EntityRecordPayload>((recordValues, field) => {
    const value = values[field.name];

    if (field.type === "date" && dayjs.isDayjs(value)) {
      recordValues[field.name] = value.format("YYYY-MM-DD");
      return recordValues;
    }

    if (value === "") {
      recordValues[field.name] = null;
      return recordValues;
    }

    recordValues[field.name] =
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
        ? value
        : null;
    return recordValues;
  }, {});
}

export function isEmptyRecordValue(value: unknown) {
  return value === null || value === undefined || value === "";
}

export function formatRecordValue(value: unknown) {
  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }

  if (value instanceof Date) {
    return value.toLocaleDateString("es-CO");
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}
