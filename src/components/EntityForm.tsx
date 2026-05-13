import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input } from "antd";
import type { CreateEntityInput } from "../services/entityService";

type EntityFormProps = {
  isSubmitting: boolean;
  onCreate: (data: CreateEntityInput) => Promise<void>;
};

export default function EntityForm({
  isSubmitting,
  onCreate,
}: EntityFormProps) {
  const [form] = Form.useForm<CreateEntityInput>();

  const submit = async (values: CreateEntityInput) => {
    await onCreate({
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
    });
    form.resetFields();
  };

  return (
    <Card title="Crear entidad de negocio" className="section-card">
      <Form form={form} layout="vertical" onFinish={submit}>
        <div className="form-grid">
          <Form.Item
            label="Nombre"
            name="name"
            rules={[
              { required: true, message: "Ingresa el nombre de la entidad." },
            ]}
          >
            <Input placeholder="Cliente" />
          </Form.Item>

          <Form.Item label="Descripción" name="description">
            <Input placeholder="Representa un cliente del negocio" />
          </Form.Item>

          <Form.Item className="form-action">
            <Button
              block
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
