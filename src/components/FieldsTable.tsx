import { Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import type { EntityField } from "../types";

type FieldsTableProps = {
  fields: EntityField[];
};

const fieldTypeLabels: Record<EntityField["type"], string> = {
  string: "Texto",
  number: "Número",
  boolean: "Verdadero/Falso",
  date: "Fecha",
};

export default function FieldsTable({ fields }: FieldsTableProps) {
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
