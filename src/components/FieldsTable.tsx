import { Table } from "antd";
import type { TableColumnsType } from "antd";
import type { EntityField } from "../types";

type FieldsTableProps = {
  fields: EntityField[];
};

export default function FieldsTable({ fields }: FieldsTableProps) {
  const columns: TableColumnsType<EntityField> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
  ];

  return (
    <Table<EntityField>
      columns={columns}
      dataSource={fields}
      locale={{ emptyText: "No fields have been defined for this entity yet." }}
      pagination={false}
      rowKey="id"
    />
  );
}
