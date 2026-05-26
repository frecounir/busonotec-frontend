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
  relationshipOptionsByFieldId: RelationshipOptionsByFieldId;
};

export type RelationshipRecordOptions = {
  entity: BusinessEntity;
  fields: EntityField[];
  records: EntityRecord[];
};

export type RelationshipOptionsByFieldId = Record<
  string,
  RelationshipRecordOptions
>;

export type BusinessEntityRelationshipReference = {
  field: EntityField;
  sourceEntity: BusinessEntity;
};

export type RelationshipReferencesByEntityId = Record<
  string,
  BusinessEntityRelationshipReference[]
>;

async function getRelationshipOptionsByFieldId(fields: EntityField[]) {
  const relationshipFields = fields.filter(
    (field) =>
      field.type === "relationship" && field.referencedBusinessEntityId,
  );
  const uniqueReferencedEntityIds = Array.from(
    new Set(
      relationshipFields
        .map((field) => field.referencedBusinessEntityId)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const referencedEntityEntries = await Promise.all(
    uniqueReferencedEntityIds.map(async (entityId) => {
      const [entity, entityFields, records] = await Promise.all([
        getEntityById(entityId),
        getFields(entityId),
        getEntityRecords(entityId),
      ]);

      return [entityId, { entity, fields: entityFields, records }] as const;
    }),
  );
  const optionsByEntityId = Object.fromEntries(referencedEntityEntries);

  return relationshipFields.reduce<RelationshipOptionsByFieldId>(
    (options, field) => {
      const referencedEntityId = field.referencedBusinessEntityId;

      if (referencedEntityId && optionsByEntityId[referencedEntityId]) {
        options[field.id] = optionsByEntityId[referencedEntityId];
      }

      return options;
    },
    {},
  );
}

export async function getRelationshipReferencesByEntityId(
  entities: BusinessEntity[],
) {
  const fieldsByEntity = await Promise.all(
    entities.map(async (entity) => {
      const fields = await getFields(entity.id);
      return { entity, fields };
    }),
  );

  return fieldsByEntity.reduce<RelationshipReferencesByEntityId>(
    (referencesByEntityId, { entity, fields }) => {
      fields.forEach((field) => {
        if (
          field.type !== "relationship" ||
          !field.referencedBusinessEntityId
        ) {
          return;
        }

        referencesByEntityId[field.referencedBusinessEntityId] = [
          ...(referencesByEntityId[field.referencedBusinessEntityId] ?? []),
          { field, sourceEntity: entity },
        ];
      });

      return referencesByEntityId;
    },
    {},
  );
}

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
  const relationshipOptionsByFieldId =
    await getRelationshipOptionsByFieldId(fields);

  return { entity, fields, records, relationshipOptionsByFieldId };
}
