import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
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

function hasNumberValidation(
  value: number | null | undefined,
): value is number {
  return typeof value === "number";
}

function renderValidationSummary(field: EntityField) {
  const tags = [];

  if (field.required) {
    tags.push(<Tag key="required">Obligatorio</Tag>);
  }

  if (field.type === "string") {
    if (hasNumberValidation(field.minLength)) {
      tags.push(<Tag key="minLength">Mínimo {field.minLength} caracteres</Tag>);
    }

    if (hasNumberValidation(field.maxLength)) {
      tags.push(<Tag key="maxLength">Máximo {field.maxLength} caracteres</Tag>);
    }
  }

  if (field.type === "number") {
    if (hasNumberValidation(field.minValue)) {
      tags.push(<Tag key="minValue">Mínimo {field.minValue}</Tag>);
    }

    if (hasNumberValidation(field.maxValue)) {
      tags.push(<Tag key="maxValue">Máximo {field.maxValue}</Tag>);
    }
  }

  if (field.type === "date") {
    if (field.minDate) {
      tags.push(<Tag key="minDate">Desde {field.minDate}</Tag>);
    }

    if (field.maxDate) {
      tags.push(<Tag key="maxDate">Hasta {field.maxDate}</Tag>);
    }
  }

  return tags.length > 0 ? (
    <Space size={[0, 8]} wrap>
      {tags}
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
        <Tag color="cyan">{fieldTypeLabels[type]}</Tag>
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
