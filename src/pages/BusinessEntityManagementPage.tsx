import { Alert, Card, Empty, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EntityRecordForm from "../components/EntityRecordForm";
import EntityRecordsTable from "../components/EntityRecordsTable";
import { getEntityById } from "../services/entityService";
import { getFields } from "../services/fieldService";
import {
  createEntityRecord,
  deleteEntityRecord,
  getEntityRecords,
  updateEntityRecord,
} from "../services/entityRecordService";
import type {
  BusinessEntity,
  EntityField,
  EntityRecord,
  EntityRecordPayload,
} from "../types";

const { Paragraph, Text, Title } = Typography;

export default function BusinessEntityManagementPage() {
  const { entityId } = useParams();
  const [entity, setEntity] = useState<BusinessEntity | null>(null);
  const [fields, setFields] = useState<EntityField[]>([]);
  const [records, setRecords] = useState<EntityRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<EntityRecord | null>(null);
  const [isLoadingConfiguration, setIsLoadingConfiguration] = useState(
    Boolean(entityId),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadManagementData = async (businessEntityId: string) => {
    setError(null);
    setIsLoadingConfiguration(true);
    try {
      const [entityResponse, fieldsResponse, recordsResponse] =
        await Promise.all([
          getEntityById(businessEntityId),
          getFields(businessEntityId),
          getEntityRecords(businessEntityId),
        ]);
      setEntity(entityResponse);
      setFields(fieldsResponse);
      setRecords(recordsResponse);
    } catch {
      setError("The selected business entity data could not be loaded.");
    } finally {
      setIsLoadingConfiguration(false);
    }
  };

  const handleSaveRecord = async (values: EntityRecordPayload) => {
    if (!entityId) {
      return;
    }

    try {
      setError(null);
      setIsSaving(true);

      if (editingRecord) {
        await updateEntityRecord(entityId, { id: editingRecord.id, ...values });
      } else {
        await createEntityRecord(entityId, values);
      }

      setEditingRecord(null);
      await loadManagementData(entityId);
    } catch {
      setError("The record could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecord = async (record: EntityRecord) => {
    if (!entityId) {
      return;
    }

    try {
      setError(null);
      setIsDeleting(true);
      await deleteEntityRecord(entityId, record);

      if (editingRecord?.id === record.id) {
        setEditingRecord(null);
      }

      await loadManagementData(entityId);
    } catch {
      setError("The record could not be deleted.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (!entityId) {
      return;
    }

    let isActive = true;

    Promise.all([
      getEntityById(entityId),
      getFields(entityId),
      getEntityRecords(entityId),
    ])
      .then(([entityResponse, fieldsResponse, recordsResponse]) => {
        if (isActive) {
          setEntity(entityResponse);
          setFields(fieldsResponse);
          setRecords(recordsResponse);
          setEditingRecord(null);
        }
      })
      .catch(() => {
        if (isActive) {
          setError("The selected business entity data could not be loaded.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingConfiguration(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [entityId]);

  if (!entityId) {
    return (
      <section className="page-stack wide-page">
        <Card className="section-card">
          <Empty description="Select a generated business entity from the sidebar menu." />
        </Card>
      </section>
    );
  }

  return (
    <section className="page-stack wide-page">
      <div>
        <Text type="secondary" strong>
          Generated management
        </Text>
        <Title level={2}>{entity?.name || "Business Entity Management"}</Title>
        <Paragraph>
          Insert, update, and delete dynamic records for this business entity
          based on its field definition.
        </Paragraph>
      </div>

      {error && <Alert title={error} type="error" showIcon />}

      <Spin
        spinning={isLoadingConfiguration}
        description="Loading entity fields and records..."
      >
        <div className="management-grid">
          <div>
            {fields.length === 0 ? (
              <Card className="section-card">
                <Empty description="Define fields for this entity before inserting records." />
              </Card>
            ) : (
              <EntityRecordForm
                editingRecord={editingRecord}
                fields={fields}
                isSubmitting={isSaving}
                onCancelEdit={() => setEditingRecord(null)}
                onSubmit={handleSaveRecord}
              />
            )}
          </div>

          <Card
            className="section-card"
            title={`${entity?.name || "Entity"} records`}
          >
            <EntityRecordsTable
              fields={fields}
              isDeleting={isDeleting}
              onDelete={handleDeleteRecord}
              onEdit={setEditingRecord}
              records={records}
            />
          </Card>
        </div>
      </Spin>
    </section>
  );
}
