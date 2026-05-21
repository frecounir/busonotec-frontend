import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";
import type { CreateFieldInput } from "../services/fieldService";
import { validateFieldDefinition } from "../services/validationService";
import type { EntityFieldType } from "../types";

type FieldFormProps = {
  isSubmitting: boolean;
  onCreate: (data: Omit<CreateFieldInput, "businessEntityId">) => Promise<void>;
};

type FieldFormValues = Omit<CreateFieldInput, "businessEntityId"> & {
  minDate?: Dayjs | string | null;
  maxDate?: Dayjs | string | null;
};

const fieldTypes: EntityFieldType[] = ["string", "number", "boolean", "date"];

const fieldTypeLabels: Record<EntityFieldType, string> = {
  string: "Texto",
  number: "Número",
  boolean: "Verdadero/Falso",
  date: "Fecha",
};

const validationFieldNames: (keyof FieldFormValues)[] = [
  "name",
  "type",
  "required",
  "minLength",
  "maxLength",
  "minValue",
  "maxValue",
  "minDate",
  "maxDate",
];

function normalizeNumber(value: number | null | undefined) {
  return typeof value === "number" ? value : undefined;
}

function normalizeDate(value: Dayjs | string | null | undefined) {
  if (dayjs.isDayjs(value)) {
    return value.format("YYYY-MM-DD");
  }

  return typeof value === "string" ? value : undefined;
}

function normalizeFieldValues(values: FieldFormValues) {
  const base: Omit<CreateFieldInput, "businessEntityId"> = {
    name: typeof values.name === "string" ? values.name.trim() : "",
    required: values.required ?? false,
    type: values.type ?? "string",
  };

  if (values.type === "string") {
    return {
      ...base,
      maxLength: normalizeNumber(values.maxLength),
      minLength: normalizeNumber(values.minLength),
    };
  }

  if (values.type === "number") {
    return {
      ...base,
      maxValue: normalizeNumber(values.maxValue),
      minValue: normalizeNumber(values.minValue),
    };
  }

  if (values.type === "date") {
    return {
      ...base,
      maxDate: normalizeDate(values.maxDate),
      minDate: normalizeDate(values.minDate),
    };
  }

  return base;
}

export default function FieldForm({ isSubmitting, onCreate }: FieldFormProps) {
  const [form] = Form.useForm<FieldFormValues>();
  const [isFormValid, setIsFormValid] = useState(false);
  const selectedType = Form.useWatch("type", form) ?? "string";

  const syncValidationErrors = (values: FieldFormValues) => {
    const fieldValues = normalizeFieldValues(values);
    const validationErrors = validateFieldDefinition(fieldValues);
    const errorsByField = validationErrors.reduce<Record<string, string[]>>(
      (errors, error) => {
        errors[error.name] = [...(errors[error.name] ?? []), error.message];
        return errors;
      },
      {},
    );

    form.setFields(
      validationFieldNames.map((fieldName) => ({
        errors: errorsByField[fieldName] ?? [],
        name: fieldName,
      })),
    );

    setIsFormValid(validationErrors.length === 0);

    return validationErrors;
  };

  const handleValuesChange = (
    _changedValues: Partial<FieldFormValues>,
    values: FieldFormValues,
  ) => {
    syncValidationErrors(values);
  };

  const submit = async (values: FieldFormValues) => {
    const fieldValues = normalizeFieldValues(values);
    const validationErrors = syncValidationErrors(values);

    if (validationErrors.length > 0) {
      return;
    }

    await onCreate(fieldValues);
    form.resetFields();
    setIsFormValid(false);
  };

  return (
    <Card title="Agregar campo" className="section-card">
      <Form
        form={form}
        initialValues={{ required: false, type: "string" }}
        layout="vertical"
        onValuesChange={handleValuesChange}
        onFinish={submit}
      >
        <div className="field-base-grid">
          <Form.Item label="Nombre" name="name">
            <Input placeholder="correo_electronico" />
          </Form.Item>

          <Form.Item label="Tipo" name="type">
            <Select
              options={fieldTypes.map((fieldType) => ({
                label: fieldTypeLabels[fieldType],
                value: fieldType,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Obligatorio"
            name="required"
            valuePropName="checked"
          >
            <Switch checkedChildren="Sí" unCheckedChildren="No" />
          </Form.Item>

          <Form.Item className="form-action">
            <Button
              block
              disabled={!isFormValid || isSubmitting}
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={isSubmitting}
              type="primary"
            >
              Agregar campo
            </Button>
          </Form.Item>
        </div>

        {selectedType === "string" && (
          <div className="field-validation-grid">
            <Form.Item label="Longitud mínima" name="minLength">
              <InputNumber min={0} precision={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Longitud máxima" name="maxLength">
              <InputNumber min={0} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </div>
        )}

        {selectedType === "number" && (
          <div className="field-validation-grid">
            <Form.Item label="Valor mínimo" name="minValue">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Valor máximo" name="maxValue">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>
        )}

        {selectedType === "date" && (
          <div className="field-validation-grid">
            <Form.Item label="Fecha mínima" name="minDate">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Fecha máxima" name="maxDate">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </div>
        )}
      </Form>
    </Card>
  );
}
