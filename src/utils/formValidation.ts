import dayjs from "dayjs";
import { z } from "zod";
import type {
  CreateEntityInput,
  CreateFieldInput,
  EntityField,
  EntityRecordPayload,
} from "../types";

export type ValidationError = {
  name: string;
  message: string;
};

const IDENTIFIER_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{0,62}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const fieldNameSchema = z
  .string({ error: "Ingresa el nombre del campo." })
  .trim()
  .min(1, { error: "Ingresa el nombre del campo." })
  .max(63, { error: "El nombre debe tener máximo 63 caracteres." })
  .regex(IDENTIFIER_PATTERN, {
    error:
      "Usa solo letras, números y guiones bajos. El nombre debe iniciar con una letra.",
  });

const businessEntityNameSchema = z
  .string({ error: "Ingresa el nombre de la entidad." })
  .trim()
  .min(1, { error: "Ingresa el nombre de la entidad." })
  .max(63, { error: "El nombre debe tener máximo 63 caracteres." })
  .regex(IDENTIFIER_PATTERN, {
    error:
      "Usa solo letras, números y guiones bajos. El nombre debe iniciar con una letra.",
  });

const businessEntitySchema = z.object({
  description: z.string().optional(),
  name: businessEntityNameSchema,
});

const optionalIntegerSchema = z
  .number({ error: "Ingresa un número válido." })
  .int({ error: "Ingresa un número entero." })
  .min(0, { error: "El valor debe ser mayor o igual a 0." })
  .optional();

const optionalNumberSchema = z
  .number({ error: "Ingresa un número válido." })
  .optional();

const optionalDateSchema = z
  .string({ error: "Ingresa una fecha válida." })
  .regex(ISO_DATE_PATTERN, { error: "Usa una fecha válida." })
  .optional();

const relationshipTypeSchema = z
  .enum(["many_to_one", "one_to_one"], {
    error: "Selecciona una cardinalidad válida.",
  })
  .optional();

const createFieldSchema = z
  .object({
    businessEntityId: z.string().optional(),
    maxDate: optionalDateSchema,
    maxLength: optionalIntegerSchema,
    maxValue: optionalNumberSchema,
    minDate: optionalDateSchema,
    minLength: optionalIntegerSchema,
    minValue: optionalNumberSchema,
    name: fieldNameSchema,
    referencedBusinessEntityId: z.string().optional(),
    required: z.boolean().optional(),
    relationshipType: relationshipTypeSchema,
    type: z.enum(["string", "number", "boolean", "date", "relationship"], {
      error: "Selecciona un tipo válido.",
    }),
  })
  .superRefine((field, context) => {
    if (field.type === "relationship") {
      if (!field.relationshipType) {
        context.addIssue({
          code: "custom",
          message: "Selecciona la cardinalidad de la relación.",
          path: ["relationshipType"],
        });
      }

      if (!field.referencedBusinessEntityId) {
        context.addIssue({
          code: "custom",
          message: "Selecciona la entidad relacionada.",
          path: ["referencedBusinessEntityId"],
        });
      }
    }

    if (
      field.type === "string" &&
      field.minLength !== undefined &&
      field.maxLength !== undefined &&
      field.minLength > field.maxLength
    ) {
      context.addIssue({
        code: "custom",
        message: "La longitud máxima debe ser mayor o igual a la mínima.",
        path: ["maxLength"],
      });
    }

    if (
      field.type === "number" &&
      field.minValue !== undefined &&
      field.maxValue !== undefined &&
      field.minValue > field.maxValue
    ) {
      context.addIssue({
        code: "custom",
        message: "El valor máximo debe ser mayor o igual al mínimo.",
        path: ["maxValue"],
      });
    }

    if (
      field.type === "date" &&
      field.minDate &&
      field.maxDate &&
      dayjs(field.minDate).isAfter(dayjs(field.maxDate), "day")
    ) {
      context.addIssue({
        code: "custom",
        message: "La fecha máxima debe ser posterior o igual a la mínima.",
        path: ["maxDate"],
      });
    }
  });

function toValidationErrors(error: z.ZodError): ValidationError[] {
  return error.issues.map((issue) => ({
    message: issue.message,
    name: typeof issue.path[0] === "string" ? issue.path[0] : "name",
  }));
}

function optionalValue<T extends z.ZodType>(schema: T) {
  return z.preprocess(
    (value) => (value === "" ? null : value),
    z.union([schema, z.null(), z.undefined()]),
  );
}

function buildStringRecordSchema(field: EntityField) {
  let schema = z.string({
    error: field.required
      ? `Ingresa ${field.name}.`
      : `${field.name} no es válido.`,
  });

  if (field.required) {
    schema = schema.trim().min(1, { error: `Ingresa ${field.name}.` });
  }

  if (typeof field.minLength === "number") {
    schema = schema.min(field.minLength, {
      error: `${field.name} debe tener al menos ${field.minLength} caracteres.`,
    });
  }

  if (typeof field.maxLength === "number") {
    schema = schema.max(field.maxLength, {
      error: `${field.name} debe tener máximo ${field.maxLength} caracteres.`,
    });
  }

  return field.required ? schema : optionalValue(schema);
}

function buildNumberRecordSchema(field: EntityField) {
  let schema = z.number({
    error: field.required
      ? `Ingresa ${field.name}.`
      : `${field.name} no es válido.`,
  });

  if (typeof field.minValue === "number") {
    schema = schema.min(field.minValue, {
      error: `${field.name} debe ser mayor o igual a ${field.minValue}.`,
    });
  }

  if (typeof field.maxValue === "number") {
    schema = schema.max(field.maxValue, {
      error: `${field.name} debe ser menor o igual a ${field.maxValue}.`,
    });
  }

  return field.required ? schema : optionalValue(schema);
}

function buildDateRecordSchema(field: EntityField) {
  let schema = z
    .string({
      error: field.required
        ? `Ingresa ${field.name}.`
        : `${field.name} no es válido.`,
    })
    .regex(ISO_DATE_PATTERN, { error: "Usa una fecha válida." });

  if (field.minDate) {
    schema = schema.refine(
      (value) => !dayjs(value).isBefore(dayjs(field.minDate), "day"),
      { error: `${field.name} debe ser desde ${field.minDate}.` },
    );
  }

  if (field.maxDate) {
    schema = schema.refine(
      (value) => !dayjs(value).isAfter(dayjs(field.maxDate), "day"),
      { error: `${field.name} debe ser hasta ${field.maxDate}.` },
    );
  }

  return field.required ? schema : optionalValue(schema);
}

function buildBooleanRecordSchema(field: EntityField) {
  const schema = z.boolean({
    error: field.required
      ? `Selecciona ${field.name}.`
      : `${field.name} no es válido.`,
  });

  return field.required ? schema : optionalValue(schema);
}

function buildRelationshipRecordSchema(field: EntityField) {
  const schema = z
    .string({
      error: field.required
        ? `Selecciona ${field.name}.`
        : `${field.name} no es válido.`,
    })
    .trim()
    .min(1, { error: `Selecciona ${field.name}.` });

  return field.required ? schema : optionalValue(schema);
}

function buildRecordFieldSchema(field: EntityField) {
  if (field.type === "number") {
    return buildNumberRecordSchema(field);
  }

  if (field.type === "boolean") {
    return buildBooleanRecordSchema(field);
  }

  if (field.type === "date") {
    return buildDateRecordSchema(field);
  }

  if (field.type === "relationship") {
    return buildRelationshipRecordSchema(field);
  }

  return buildStringRecordSchema(field);
}

export function validateFieldDefinition(
  field: Omit<CreateFieldInput, "businessEntityId">,
) {
  const result = createFieldSchema.safeParse(field);

  if (result.success) {
    return [];
  }

  return toValidationErrors(result.error);
}

export function validateBusinessEntityDefinition(entity: CreateEntityInput) {
  const result = businessEntitySchema.safeParse(entity);

  if (result.success) {
    return [];
  }

  return toValidationErrors(result.error);
}

export function validateRecordValues(
  fields: EntityField[],
  values: EntityRecordPayload,
) {
  const shape = fields.reduce<Record<string, z.ZodType>>((schema, field) => {
    schema[field.name] = buildRecordFieldSchema(field);
    return schema;
  }, {});
  const result = z.object(shape).safeParse(values);

  if (result.success) {
    return [];
  }

  return toValidationErrors(result.error);
}
