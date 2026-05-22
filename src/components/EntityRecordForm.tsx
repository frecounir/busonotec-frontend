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
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import type { EntityField, EntityRecord, EntityRecordPayload } from "../types";
import { validateRecordValues } from "../utils/formValidation";
import {
  getInitialRecordFieldValue,
  normalizeRecordValues,
  type RecordFormValues,
} from "../utils/recordValues";
import { applyValidationErrorsToForm } from "../utils/validationErrors";

type EntityRecordFormProps = {
  editingRecord: EntityRecord | null;
  fields: EntityField[];
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (values: EntityRecordPayload) => Promise<void>;
};

function renderFieldInput(field: EntityField) {
  if (field.type === "number") {
    return (
      <InputNumber
        max={field.maxValue ?? undefined}
        min={field.minValue ?? undefined}
        style={{ width: "100%" }}
      />
    );
  }

  if (field.type === "boolean") {
    return <Switch checkedChildren="Sí" unCheckedChildren="No" />;
  }

  if (field.type === "date") {
    return (
      <DatePicker
        disabledDate={(currentDate) =>
          Boolean(
            (field.minDate &&
              currentDate.isBefore(dayjs(field.minDate), "day")) ||
            (field.maxDate && currentDate.isAfter(dayjs(field.maxDate), "day")),
          )
        }
        style={{ width: "100%" }}
      />
    );
  }

  return <Input maxLength={field.maxLength ?? undefined} />;
}

export default function EntityRecordForm({
  editingRecord,
  fields,
  isSubmitting,
  onCancelEdit,
  onSubmit,
}: EntityRecordFormProps) {
  const [form] = Form.useForm<RecordFormValues>();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const initialValues = fields.reduce<RecordFormValues>((values, field) => {
      values[field.name] = getInitialRecordFieldValue(field, editingRecord);
      return values;
    }, {});
    const initialIsFormValid =
      validateRecordValues(fields, normalizeRecordValues(fields, initialValues))
        .length === 0;

    form.setFieldsValue(initialValues);
    form.setFields(fields.map((field) => ({ errors: [], name: field.name })));

    const timeoutId = window.setTimeout(() => {
      setIsFormValid(initialIsFormValid);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [editingRecord, fields, form]);

  const submit = async (values: RecordFormValues) => {
    const validationErrors = syncValidationErrors(values);

    if (validationErrors.length > 0) {
      return;
    }

    const recordValues = normalizeRecordValues(fields, values);
    await onSubmit(recordValues);
    form.resetFields();
    setIsFormValid(false);
  };

  const syncValidationErrors = (values: RecordFormValues) => {
    const recordValues = normalizeRecordValues(fields, values);
    const validationErrors = validateRecordValues(fields, recordValues);

    applyValidationErrorsToForm(
      form,
      fields.map((field) => field.name),
      validationErrors,
    );

    setIsFormValid(validationErrors.length === 0);

    return validationErrors;
  };

  const handleValuesChange = (
    _changedValues: RecordFormValues,
    values: RecordFormValues,
  ) => {
    syncValidationErrors(values);
  };

  return (
    <Card
      className="section-card"
      title={editingRecord ? "Actualizar registro" : "Crear registro"}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        onValuesChange={handleValuesChange}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.id}
            label={field.name}
            name={field.name}
            valuePropName={field.type === "boolean" ? "checked" : "value"}
          >
            {renderFieldInput(field)}
          </Form.Item>
        ))}

        <Space wrap>
          <Button
            disabled={!isFormValid || isSubmitting}
            htmlType="submit"
            loading={isSubmitting}
            type="primary"
          >
            {editingRecord ? "Actualizar" : "Crear"}
          </Button>
          {editingRecord && <Button onClick={onCancelEdit}>Cancelar</Button>}
        </Space>
      </Form>
    </Card>
  );
}
