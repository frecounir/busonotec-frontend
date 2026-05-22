import { API_BASE_URL } from "./apiConfig";

type RequestOptions = RequestInit & {
  errorMessage?: string;
};

class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { errorMessage = "No fue posible completar la solicitud.", ...init } =
      options;
    const response = await fetch(`${this.baseUrl}${url}`, init);

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  get<T>(url: string, errorMessage?: string): Promise<T> {
    return this.request<T>(url, { errorMessage });
  }

  post<T>(url: string, data: unknown, errorMessage?: string): Promise<T> {
    return this.request<T>(url, {
      body: JSON.stringify(data),
      errorMessage,
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
  }

  patch<T>(url: string, data: unknown, errorMessage?: string): Promise<T> {
    return this.request<T>(url, {
      body: JSON.stringify(data),
      errorMessage,
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    });
  }

  delete<T>(url: string, errorMessage?: string): Promise<T> {
    return this.request<T>(url, {
      errorMessage,
      method: "DELETE",
    });
  }
}

export const apiClient = new HttpClient(API_BASE_URL);
