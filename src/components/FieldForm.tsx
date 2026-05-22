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
import { useState } from "react";
import type { CreateFieldInput } from "../types";
import { FIELD_TYPE_LABELS, FIELD_TYPES } from "../utils/fieldMetadata";
import { validateFieldDefinition } from "../utils/formValidation";
import {
  normalizeFieldValues,
  type FieldFormValues,
} from "../utils/formNormalizers";
import { applyValidationErrorsToForm } from "../utils/validationErrors";

type FieldFormProps = {
  isSubmitting: boolean;
  onCreate: (data: Omit<CreateFieldInput, "businessEntityId">) => Promise<void>;
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

export default function FieldForm({ isSubmitting, onCreate }: FieldFormProps) {
  const [form] = Form.useForm<FieldFormValues>();
  const [isFormValid, setIsFormValid] = useState(false);
  const selectedType = Form.useWatch("type", form) ?? "string";

  const syncValidationErrors = (values: FieldFormValues) => {
    const fieldValues = normalizeFieldValues(values);
    const validationErrors = validateFieldDefinition(fieldValues);

    applyValidationErrorsToForm(form, validationFieldNames, validationErrors);

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
              options={FIELD_TYPES.map((fieldType) => ({
                label: FIELD_TYPE_LABELS[fieldType],
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
