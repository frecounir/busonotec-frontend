import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import type { EntityField, EntityRecord } from "../types";

type EntityRecordWithOptionalValues = EntityRecord & {
  values?: Record<string, unknown>;
};

type EntityRecordsTableProps = {
  fields: EntityField[];
  isDeleting: boolean;
  onDelete: (record: EntityRecord) => Promise<void>;
  onEdit: (record: EntityRecord) => void;
  records: EntityRecord[];
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

function getRecordFieldValue(record: EntityRecord, fieldName: string) {
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

function formatRecordValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return <Typography.Text type="secondary">Vacío</Typography.Text>;
  }

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

export default function EntityRecordsTable({
  fields,
  isDeleting,
  onDelete,
  onEdit,
  records,
}: EntityRecordsTableProps) {
  const columns: TableColumnsType<EntityRecord> = [
    ...fields.map((field) => ({
      title: field.name,
      key: field.id,
      render: (_: unknown, record: EntityRecord) => {
        const value = getRecordFieldValue(record, field.name);
        return formatRecordValue(value);
      },
    })),
    {
      title: "Acciones",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space wrap>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Actualizar
          </Button>
          <Popconfirm
            title="Eliminar registro"
            description="Este registro se eliminará de los datos de la entidad."
            okButtonProps={{ danger: true, loading: isDeleting }}
            okText="Eliminar"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table<EntityRecord>
      columns={columns}
      dataSource={records}
      locale={{
        emptyText: "Aún no se han insertado registros para esta entidad.",
      }}
      rowKey="id"
      scroll={{ x: true }}
    />
  );
}
