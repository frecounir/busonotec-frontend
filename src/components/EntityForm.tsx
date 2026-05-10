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
    <Card title="Create business entity" className="section-card">
      <Form form={form} layout="vertical" onFinish={submit}>
        <div className="form-grid">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the entity name." },
            ]}
          >
            <Input placeholder="Customer" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input placeholder="Represents a business customer" />
          </Form.Item>

          <Form.Item className="form-action">
            <Button
              block
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={isSubmitting}
              type="primary"
            >
              Create Entity
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
