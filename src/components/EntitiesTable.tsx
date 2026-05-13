import { DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { Link } from "react-router-dom";
import type { BusinessEntity } from "../types";

type EntitiesTableProps = {
  deletingEntityId?: string | null;
  entities: BusinessEntity[];
  onDelete: (entity: BusinessEntity) => Promise<void>;
};

export default function EntitiesTable({
  deletingEntityId,
  entities,
  onDelete,
}: EntitiesTableProps) {
  const columns: TableColumnsType<BusinessEntity> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      render: (description?: string) =>
        description || (
          <Typography.Text type="secondary">Sin descripción</Typography.Text>
        ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, entity) => (
        <Space wrap>
          <Link to={`/entities/${entity.id}`}>
            <Button icon={<SettingOutlined />} type="primary">
              Gestionar
            </Button>
          </Link>
          <Popconfirm
            title="Eliminar entidad"
            description="Se eliminará la entidad, sus campos y su tabla física."
            okButtonProps={{
              danger: true,
              loading: deletingEntityId === entity.id,
            }}
            okText="Eliminar"
            cancelText="Cancelar"
            onConfirm={() => onDelete(entity)}
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
    <Table<BusinessEntity>
      columns={columns}
      dataSource={entities}
      locale={{ emptyText: "Aún no se han creado entidades de negocio." }}
      pagination={false}
      rowKey="id"
      scroll={{ x: true }}
    />
  );
}
