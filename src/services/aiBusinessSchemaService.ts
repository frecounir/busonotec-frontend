import type { AiBusinessSchemaPlan, AiBusinessSchemaResponse } from "../types";
import { apiClient } from "./httpClient";

const AI_SCHEMA_ERROR_MESSAGE =
  "No fue posible completar la solicitud del agente generativo.";

export type CreateSchemaFromPromptInput = {
  prompt: string;
};

export function createBusinessSchemaPlan(
  data: CreateSchemaFromPromptInput,
): Promise<AiBusinessSchemaPlan> {
  return apiClient.post<AiBusinessSchemaPlan>(
    "/ai/business-schema/plan",
    data,
    AI_SCHEMA_ERROR_MESSAGE,
  );
}

export function executeBusinessSchemaPlan(
  plan: AiBusinessSchemaPlan,
): Promise<AiBusinessSchemaResponse> {
  return apiClient.post<AiBusinessSchemaResponse>(
    "/ai/business-schema/execute",
    plan,
    AI_SCHEMA_ERROR_MESSAGE,
  );
}
