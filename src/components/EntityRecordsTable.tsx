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
          <Typography.Text type="secondary">Vacío</Typography.Text>
        ) : (
          String(value)
        );
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
