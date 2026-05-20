import type { AiBusinessSchemaPlan, AiBusinessSchemaResponse } from "../types";
import { API_BASE_URL } from "./apiConfig";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, options);

  if (!response.ok) {
    throw new Error(
      "No fue posible completar la solicitud del agente generativo.",
    );
  }

  return response.json() as Promise<T>;
}

export type CreateSchemaFromPromptInput = {
  prompt: string;
};

export function createBusinessSchemaPlan(
  data: CreateSchemaFromPromptInput,
): Promise<AiBusinessSchemaPlan> {
  return request<AiBusinessSchemaPlan>("/ai/business-schema/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function executeBusinessSchemaPlan(
  plan: AiBusinessSchemaPlan,
): Promise<AiBusinessSchemaResponse> {
  return request<AiBusinessSchemaResponse>("/ai/business-schema/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plan),
  });
}
