import type { AiBusinessSchemaResponse } from "../types";

const API_BASE_URL = "http://localhost:8080/api";

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

export function createBusinessSchemaFromPrompt(
  data: CreateSchemaFromPromptInput,
): Promise<AiBusinessSchemaResponse> {
  return request<AiBusinessSchemaResponse>("/ai/business-schema", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
