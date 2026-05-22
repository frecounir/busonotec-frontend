import type { BusinessEntity, EntityField, EntityRecord } from "../types";
import { getEntityById } from "./entityService";
import { getEntityRecords } from "./entityRecordService";
import { getFields } from "./fieldService";

export type BusinessEntityConfiguration = {
  entity: BusinessEntity;
  fields: EntityField[];
};

export type BusinessEntityManagementData = BusinessEntityConfiguration & {
  records: EntityRecord[];
};

export async function getBusinessEntityConfiguration(
  entityId: string,
): Promise<BusinessEntityConfiguration> {
  const [entity, fields] = await Promise.all([
    getEntityById(entityId),
    getFields(entityId),
  ]);

  return { entity, fields };
}

export async function getBusinessEntityManagementData(
  entityId: string,
): Promise<BusinessEntityManagementData> {
  const [entity, fields, records] = await Promise.all([
    getEntityById(entityId),
    getFields(entityId),
    getEntityRecords(entityId),
  ]);

  return { entity, fields, records };
}
