import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import type { CreateEntityInput, CreateFieldInput } from "../types";

export type FieldFormValues = Omit<CreateFieldInput, "businessEntityId"> & {
  minDate?: Dayjs | string | null;
  maxDate?: Dayjs | string | null;
};

function normalizeNumber(value: number | null | undefined) {
  return typeof value === "number" ? value : undefined;
}

function normalizeDate(value: Dayjs | string | null | undefined) {
  if (dayjs.isDayjs(value)) {
    return value.format("YYYY-MM-DD");
  }

  return typeof value === "string" ? value : undefined;
}

export function normalizeEntityValues(
  values: CreateEntityInput,
): CreateEntityInput {
  return {
    description: values.description?.trim() || undefined,
    name: typeof values.name === "string" ? values.name.trim() : "",
  };
}

export function normalizeFieldValues(values: FieldFormValues) {
  const base: Omit<CreateFieldInput, "businessEntityId"> = {
    name: typeof values.name === "string" ? values.name.trim() : "",
    required: values.required ?? false,
    type: values.type ?? "string",
  };

  if (values.type === "string") {
    return {
      ...base,
      maxLength: normalizeNumber(values.maxLength),
      minLength: normalizeNumber(values.minLength),
    };
  }

  if (values.type === "number") {
    return {
      ...base,
      maxValue: normalizeNumber(values.maxValue),
      minValue: normalizeNumber(values.minValue),
    };
  }

  if (values.type === "date") {
    return {
      ...base,
      maxDate: normalizeDate(values.maxDate),
      minDate: normalizeDate(values.minDate),
    };
  }

  if (values.type === "relationship") {
    return {
      ...base,
      referencedBusinessEntityId:
        values.referencedBusinessEntityId?.trim() || undefined,
      relationshipType: values.relationshipType ?? "many_to_one",
    };
  }

  return base;
}
