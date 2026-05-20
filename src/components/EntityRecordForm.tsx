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
import type { EntityField, EntityRecord, EntityRecordPayload } from "../types";

type EntityRecordFormProps = {
  editingRecord: EntityRecord | null;
  fields: EntityField[];
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (values: EntityRecordPayload) => Promise<void>;
};

type FormValues = Record<
  string,
  string | number | boolean | Dayjs | null | undefined
>;

type EntityRecordWithOptionalValues = EntityRecord & {
  values?: Record<string, unknown>;
};

function normalizeRecordKey(key: string) {
  return key
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_-]/g, "")
    .toLowerCase();
}

function findValueByFieldName(
  source: Record<string, unknown>,
  fieldName: string,
) {
  if (Object.prototype.hasOwnProperty.call(source, fieldName)) {
    return source[fieldName];
  }

  const caseInsensitiveKey = Object.keys(source).find(
    (key) => key.toLowerCase() === fieldName.toLowerCase(),
  );

  if (caseInsensitiveKey) {
    return source[caseInsensitiveKey];
  }

  const normalizedFieldName = normalizeRecordKey(fieldName);
  const normalizedKey = Object.keys(source).find(
    (key) => normalizeRecordKey(key) === normalizedFieldName,
  );

  return normalizedKey ? source[normalizedKey] : undefined;
}

function getRecordFieldValue(record: EntityRecord | null, fieldName: string) {
  if (!record) {
    return undefined;
  }

  const recordSource = record as Record<string, unknown>;
  const value = findValueByFieldName(recordSource, fieldName);

  if (value !== undefined) {
    return value;
  }

  const nestedValues = (record as EntityRecordWithOptionalValues).values;

  if (nestedValues && typeof nestedValues === "object") {
    return findValueByFieldName(nestedValues, fieldName);
  }

  return undefined;
}

function getInitialValue(field: EntityField, record: EntityRecord | null) {
  const value = getRecordFieldValue(record, field.name);

  if (field.type === "date" && typeof value === "string") {
    return dayjs(value);
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  return field.type === "boolean" ? false : undefined;
}

function normalizeValues(
  fields: EntityField[],
  values: FormValues,
): EntityRecordPayload {
  return fields.reduce<EntityRecordPayload>((recordValues, field) => {
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
    return <Switch checkedChildren="Sí" unCheckedChildren="No" />;
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
      title={editingRecord ? "Actualizar registro" : "Crear registro"}
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
                message: `Ingresa ${field.name}.`,
              },
            ]}
          >
            {renderFieldInput(field)}
          </Form.Item>
        ))}

        <Space wrap>
          <Button htmlType="submit" loading={isSubmitting} type="primary">
            {editingRecord ? "Actualizar" : "Crear"}
          </Button>
          {editingRecord && <Button onClick={onCancelEdit}>Cancelar</Button>}
        </Space>
      </Form>
    </Card>
  );
}
