import { PlusOutlined, RobotOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import { type RefObject, useState } from "react";
import type { CreateEntityInput } from "../types";
import { validateBusinessEntityDefinition } from "../utils/formValidation";
import { normalizeEntityValues } from "../utils/formNormalizers";
import { applyValidationErrorsToForm } from "../utils/validationErrors";

type EntityFormProps = {
  aiToggleButtonRef?: RefObject<HTMLAnchorElement | HTMLButtonElement | null>;
  isAiSectionVisible: boolean;
  isSubmitting: boolean;
  onCreate: (data: CreateEntityInput) => Promise<void>;
  onToggleAiSection: () => void;
};

const validationFieldNames: (keyof CreateEntityInput)[] = [
  "name",
  "description",
];

export default function EntityForm({
  aiToggleButtonRef,
  isAiSectionVisible,
  isSubmitting,
  onCreate,
  onToggleAiSection,
}: EntityFormProps) {
  const [form] = Form.useForm<CreateEntityInput>();
  const [isFormValid, setIsFormValid] = useState(false);

  const syncValidationErrors = (values: CreateEntityInput) => {
    const entityValues = normalizeEntityValues(values);
    const validationErrors = validateBusinessEntityDefinition(entityValues);

    applyValidationErrorsToForm(form, validationFieldNames, validationErrors);

    setIsFormValid(validationErrors.length === 0);

    return validationErrors;
  };

  const handleValuesChange = (
    _changedValues: Partial<CreateEntityInput>,
    values: CreateEntityInput,
  ) => {
    syncValidationErrors(values);
  };

  const submit = async (values: CreateEntityInput) => {
    const entityValues = normalizeEntityValues(values);
    const validationErrors = syncValidationErrors(values);

    if (validationErrors.length > 0) {
      return;
    }

    await onCreate(entityValues);
    form.resetFields();
    setIsFormValid(false);
  };

  return (
    <Card
      title="Crear entidad de negocio"
      className="section-card"
      extra={
        <Button
          ref={aiToggleButtonRef}
          icon={<RobotOutlined />}
          onClick={onToggleAiSection}
        >
          {isAiSectionVisible
            ? "Ocultar agente generativo"
            : "Usar agente generativo"}
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        onValuesChange={handleValuesChange}
      >
        <div className="form-grid">
          <Form.Item label="Nombre" name="name">
            <Input placeholder="Cliente" />
          </Form.Item>

          <Form.Item label="Descripción" name="description">
            <Input placeholder="Representa un cliente del negocio" />
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
              Crear entidad
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
