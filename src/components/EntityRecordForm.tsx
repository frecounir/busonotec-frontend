import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
  Switch,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useEffect } from "react";
import type { EntityField, EntityRecord, EntityRecordValues } from "../types";

type EntityRecordFormProps = {
  editingRecord: EntityRecord | null;
  fields: EntityField[];
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (values: EntityRecordValues) => Promise<void>;
};

type FormValues = Record<
  string,
  string | number | boolean | Dayjs | null | undefined
>;

function getInitialValue(field: EntityField, record: EntityRecord | null) {
  const value = record?.values[field.name];

  if (field.type === "date" && typeof value === "string") {
    return dayjs(value);
  }

  return value ?? (field.type === "boolean" ? false : undefined);
}

function normalizeValues(
  fields: EntityField[],
  values: FormValues,
): EntityRecordValues {
  return fields.reduce<EntityRecordValues>((recordValues, field) => {
    const value = values[field.name];

    if (field.type === "date" && dayjs.isDayjs(value)) {
      recordValues[field.name] = value.format("YYYY-MM-DD");
      return recordValues;
    }

    recordValues[field.name] =
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
        ? value
        : null;
    return recordValues;
  }, {});
}

function renderFieldInput(field: EntityField) {
  if (field.type === "number") {
    return <InputNumber style={{ width: "100%" }} />;
  }

  if (field.type === "boolean") {
    return <Switch checkedChildren="Yes" unCheckedChildren="No" />;
  }

  if (field.type === "date") {
    return <DatePicker style={{ width: "100%" }} />;
  }

  return <Input />;
}

export default function EntityRecordForm({
  editingRecord,
  fields,
  isSubmitting,
  onCancelEdit,
  onSubmit,
}: EntityRecordFormProps) {
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    const initialValues = fields.reduce<FormValues>((values, field) => {
      values[field.name] = getInitialValue(field, editingRecord);
      return values;
    }, {});

    form.setFieldsValue(initialValues);
  }, [editingRecord, fields, form]);

  const submit = async (values: FormValues) => {
    await onSubmit(normalizeValues(fields, values));
    form.resetFields();
  };

  return (
    <Card
      className="section-card"
      title={editingRecord ? "Update record" : "Create record"}
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        {fields.map((field) => (
          <Form.Item
            key={field.id}
            label={field.name}
            name={field.name}
            valuePropName={field.type === "boolean" ? "checked" : "value"}
            rules={[
              {
                required: field.type !== "boolean",
                message: `Please enter ${field.name}.`,
              },
            ]}
          >
            {renderFieldInput(field)}
          </Form.Item>
        ))}

        <Space wrap>
          <Button htmlType="submit" loading={isSubmitting} type="primary">
            {editingRecord ? "Update" : "Create"}
          </Button>
          {editingRecord && <Button onClick={onCancelEdit}>Cancel</Button>}
        </Space>
      </Form>
    </Card>
  );
}
