import { SettingOutlined } from "@ant-design/icons";
import { Button, Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { Link } from "react-router-dom";
import type { BusinessEntity } from "../types";

type EntitiesTableProps = {
  entities: BusinessEntity[];
};

export default function EntitiesTable({ entities }: EntitiesTableProps) {
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
        <Link to={`/entities/${entity.id}`}>
          <Button icon={<SettingOutlined />} type="primary">
            Gestionar
          </Button>
        </Link>
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
