import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select } from "antd";
import type { CreateFieldInput } from "../services/fieldService";

type FieldFormProps = {
  isSubmitting: boolean;
  onCreate: (data: Omit<CreateFieldInput, "businessEntityId">) => Promise<void>;
};

const fieldTypes = ["string", "number", "boolean", "date"];

export default function FieldForm({ isSubmitting, onCreate }: FieldFormProps) {
  const [form] = Form.useForm<Omit<CreateFieldInput, "businessEntityId">>();

  const submit = async (values: Omit<CreateFieldInput, "businessEntityId">) => {
    await onCreate({ name: values.name.trim(), type: values.type });
    form.resetFields(["name"]);
  };

  return (
    <Card title="Add field" className="section-card">
      <Form
        form={form}
        initialValues={{ type: "string" }}
        layout="vertical"
        onFinish={submit}
      >
        <div className="field-form-grid">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the field name." },
            ]}
          >
            <Input placeholder="email" />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select
              options={fieldTypes.map((fieldType) => ({
                label: fieldType,
                value: fieldType,
              }))}
            />
          </Form.Item>

          <Form.Item className="form-action">
            <Button
              block
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={isSubmitting}
              type="primary"
            >
              Add Field
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Card>
  );
}
