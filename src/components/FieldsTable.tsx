import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import type { TableColumnsType } from "antd";
import type { EntityField } from "../types";
import { FIELD_TYPE_LABELS, getValidationLabels } from "../utils/fieldMetadata";

type FieldsTableProps = {
  fields: EntityField[];
  isDeleting: boolean;
  onDelete: (field: EntityField) => Promise<void>;
};

function renderValidationSummary(field: EntityField) {
  const validationLabels = getValidationLabels(field);

  return validationLabels.length > 0 ? (
    <Space size={[0, 8]} wrap>
      {validationLabels.map((label) => (
        <Tag key={label}>{label}</Tag>
      ))}
    </Space>
  ) : (
    <Typography.Text type="secondary">Sin validaciones</Typography.Text>
  );
}

export default function FieldsTable({
  fields,
  isDeleting,
  onDelete,
}: FieldsTableProps) {
  const columns: TableColumnsType<EntityField> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
      render: (type: EntityField["type"]) => (
        <Tag color="cyan">{FIELD_TYPE_LABELS[type]}</Tag>
      ),
    },
    {
      title: "Validaciones",
      key: "validations",
      render: (_, field) => renderValidationSummary(field),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, field) => (
        <Popconfirm
          title="Eliminar campo"
          description="Este campo se eliminará de la entidad y también de la tabla física generada."
          okButtonProps={{ danger: true, loading: isDeleting }}
          okText="Eliminar"
          onConfirm={() => onDelete(field)}
        >
          <Button danger icon={<DeleteOutlined />}>
            Eliminar
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table<EntityField>
      columns={columns}
      dataSource={fields}
      locale={{ emptyText: "Aún no se han definido campos para esta entidad." }}
      pagination={false}
      rowKey="id"
      scroll={{ x: true }}
    />
  );
}
