import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import type { EntityField, EntityRecord } from "../types";

type EntityRecordsTableProps = {
  fields: EntityField[];
  isDeleting: boolean;
  onDelete: (record: EntityRecord) => Promise<void>;
  onEdit: (record: EntityRecord) => void;
  records: EntityRecord[];
};

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
        const value = record[field.name];
        return value === null || value === undefined || value === "" ? (
          <Typography.Text type="secondary">Empty</Typography.Text>
        ) : (
          String(value)
        );
      },
    })),
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      render: (_, record) => (
        <Space wrap>
          <Button icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Update
          </Button>
          <Popconfirm
            title="Delete record"
            description="This record will be removed from the entity data."
            okButtonProps={{ danger: true, loading: isDeleting }}
            okText="Delete"
            onConfirm={() => onDelete(record)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
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
        emptyText: "No records have been inserted for this entity yet.",
      }}
      rowKey="id"
      scroll={{ x: true }}
    />
  );
}
