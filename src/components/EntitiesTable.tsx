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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description?: string) =>
        description || (
          <Typography.Text type="secondary">No description</Typography.Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, entity) => (
        <Link to={`/entities/${entity.id}`}>
          <Button icon={<SettingOutlined />} type="primary">
            Manage
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Table<BusinessEntity>
      columns={columns}
      dataSource={entities}
      locale={{ emptyText: "No business entities have been created yet." }}
      pagination={false}
      rowKey="id"
      scroll={{ x: true }}
    />
  );
}
