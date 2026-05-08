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
