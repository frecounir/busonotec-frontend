export type EntityFieldType = "string" | "number" | "boolean" | "date";

export type BusinessEntity = {
  id: string;
  name: string;
  description?: string;
};

export type EntityField = {
  id: string;
  name: string;
  type: EntityFieldType;
  businessEntityId: string;
};

export type EntityRecordValue = string | number | boolean | null;

export type EntityRecordPayload = Record<string, EntityRecordValue>;

export type EntityRecord = EntityRecordPayload & {
  id: string;
};

export type AiEntityFieldDefinition = {
  name: string;
  type: EntityFieldType;
};

export type AiBusinessEntityDefinition = {
  name: string;
  description: string;
  fields?: AiEntityFieldDefinition[];
};

export type AiBusinessSchemaPlan = {
  businessEntities: AiBusinessEntityDefinition[];
};

export type CreatedBusinessEntity = {
  businessEntity: BusinessEntity;
  fields: EntityField[];
};

export type AiBusinessSchemaResponse = {
  plan: AiBusinessSchemaPlan;
  createdBusinessEntities: CreatedBusinessEntity[];
};
