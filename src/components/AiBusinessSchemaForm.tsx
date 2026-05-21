import { RobotOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Collapse,
  Divider,
  Form,
  Input,
  List,
  Space,
  Tag,
  Typography,
} from "antd";
import type {
  AiEntityFieldDefinition,
  AiBusinessSchemaPlan,
  AiBusinessSchemaResponse,
  EntityField,
} from "../types";

const { Paragraph, Text } = Typography;

type AiBusinessSchemaFormProps = {
  executedSchema: AiBusinessSchemaResponse | null;
  generatedPlan: AiBusinessSchemaPlan | null;
  isExecuting: boolean;
  isGeneratingPlan: boolean;
  onAcceptPlan: () => Promise<void>;
  onGeneratePlan: (prompt: string) => Promise<void>;
  onRejectPlan: () => void;
};

type PromptFormValues = {
  prompt: string;
};

const fieldTypeLabels: Record<EntityField["type"], string> = {
  string: "Texto",
  number: "Número",
  boolean: "Verdadero/Falso",
  date: "Fecha",
};

type FieldDefinitionWithValidations = EntityField | AiEntityFieldDefinition;

function hasNumberValidation(
  value: number | null | undefined,
): value is number {
  return typeof value === "number";
}

function renderValidationTags(field: FieldDefinitionWithValidations) {
  const tags = [];

  if (field.required) {
    tags.push(<Tag key="required">Obligatorio</Tag>);
  }

  if (field.type === "string") {
    if (hasNumberValidation(field.minLength)) {
      tags.push(<Tag key="minLength">Mínimo {field.minLength}</Tag>);
    }

    if (hasNumberValidation(field.maxLength)) {
      tags.push(<Tag key="maxLength">Máximo {field.maxLength}</Tag>);
    }
  }

  if (field.type === "number") {
    if (hasNumberValidation(field.minValue)) {
      tags.push(<Tag key="minValue">Desde {field.minValue}</Tag>);
    }

    if (hasNumberValidation(field.maxValue)) {
      tags.push(<Tag key="maxValue">Hasta {field.maxValue}</Tag>);
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

  return tags;
}

export default function AiBusinessSchemaForm({
  executedSchema,
  generatedPlan,
  isExecuting,
  isGeneratingPlan,
  onAcceptPlan,
  onGeneratePlan,
  onRejectPlan,
}: AiBusinessSchemaFormProps) {
  const [form] = Form.useForm<PromptFormValues>();

  const submit = async (values: PromptFormValues) => {
    await onGeneratePlan(values.prompt.trim());
    form.resetFields();
  };

  return (
    <Card
      className="section-card"
      title="Crear entidades con agente generativo"
    >
      <Paragraph>
        Describe en palabras simples qué información necesita gestionar tu
        negocio. El agente generativo propondrá entidades y campos, y el backend
        las creará automáticamente.
      </Paragraph>
      <Alert
        showIcon
        type="info"
        title="Ejemplo"
        description="Crea entidades para estudiantes y actividades. Los estudiantes necesitan nombre obligatorio, correo y activo. Las actividades necesitan título de máximo 120 caracteres, fecha de inicio desde 2026-01-01 y duración entre 1 y 8."
      />

      <Form
        className="ai-schema-form"
        form={form}
        layout="vertical"
        onFinish={submit}
      >
        <Form.Item
          label="Descripción del modelo de negocio"
          name="prompt"
          rules={[
            {
              required: true,
              message: "Describe las entidades y datos que necesitas crear.",
            },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 8 }}
            placeholder="Ejemplo: Crea entidades para clientes y pedidos. Los clientes necesitan nombre, correo y activo. Los pedidos necesitan fecha, total y estado."
          />
        </Form.Item>

        <Button
          htmlType="submit"
          icon={<RobotOutlined />}
          loading={isGeneratingPlan}
          type="primary"
        >
          Generar plan
        </Button>
      </Form>

      {generatedPlan && (
        <div className="ai-schema-result">
          <Text strong>Plan propuesto por el agente</Text>
          <Paragraph>
            Revisa esta propuesta antes de crear entidades reales. Si algo no
            corresponde con tu negocio, puedes rechazarla y escribir una
            descripción más precisa.
          </Paragraph>
          <Collapse
            items={generatedPlan.businessEntities.map((entityDefinition) => ({
              key: entityDefinition.name,
              label: entityDefinition.name,
              children: (
                <>
                  <Paragraph>{entityDefinition.description}</Paragraph>
                  <List
                    dataSource={entityDefinition.fields ?? []}
                    locale={{
                      emptyText: "La entidad fue propuesta sin campos.",
                    }}
                    renderItem={(field) => (
                      <List.Item>
                        <Space wrap>
                          <Text>{field.name}</Text>
                          <Tag color="cyan">{fieldTypeLabels[field.type]}</Tag>
                          {renderValidationTags(field)}
                        </Space>
                      </List.Item>
                    )}
                  />
                </>
              ),
            }))}
          />
          <Space wrap>
            <Button loading={isExecuting} onClick={onAcceptPlan} type="primary">
              Aceptar y crear entidades
            </Button>
            <Button disabled={isExecuting} onClick={onRejectPlan}>
              Rechazar plan
            </Button>
          </Space>
        </div>
      )}

      {executedSchema && (
        <div className="ai-schema-result">
          <Divider />
          <Text strong>Resultado creado por el agente</Text>
          <Collapse
            items={executedSchema.createdBusinessEntities.map(
              (createdEntity) => ({
                key: createdEntity.businessEntity.id,
                label: createdEntity.businessEntity.name,
                children: (
                  <List
                    dataSource={createdEntity.fields}
                    locale={{ emptyText: "La entidad fue creada sin campos." }}
                    renderItem={(field) => (
                      <List.Item>
                        <Space wrap>
                          <Text>{field.name}</Text>
                          <Tag color="cyan">{fieldTypeLabels[field.type]}</Tag>
                          {renderValidationTags(field)}
                        </Space>
                      </List.Item>
                    )}
                  />
                ),
              }),
            )}
          />
        </div>
      )}
    </Card>
  );
}
