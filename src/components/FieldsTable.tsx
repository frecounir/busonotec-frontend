import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import type { EntityField } from "../types";

type FieldsTableProps = {
  fields: EntityField[];
  isDeleting: boolean;
  onDelete: (field: EntityField) => Promise<void>;
};

const fieldTypeLabels: Record<EntityField["type"], string> = {
  string: "Texto",
  number: "Número",
  boolean: "Verdadero/Falso",
  date: "Fecha",
};

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
        <Tag color="cyan">{fieldTypeLabels[type]}</Tag>
      ),
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
