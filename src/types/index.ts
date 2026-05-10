export type BusinessEntity = {
  id: string;
  name: string;
  description?: string;
};

export type EntityField = {
  id: string;
  name: string;
  type: string;
  businessEntityId: string;
};

export type EntityRecordValues = Record<
  string,
  string | number | boolean | null
>;

export type EntityRecord = {
  id: string;
  businessEntityId: string;
  values: EntityRecordValues;
};
