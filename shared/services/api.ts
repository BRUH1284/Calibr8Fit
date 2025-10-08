import { authManager } from "./authManager";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export type RequestConfig = {
  endpoint: string;
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  [key: string]: any;
};

// Utility: handles React Native FormData too
const isFormData = (v: any) =>
  v &&
  typeof v === "object" &&
  typeof v.append === "function" &&
  // RN FormData often has _parts; web FormData doesn't — either is fine
  ("_parts" in v || Object.prototype.toString.call(v) === "[object FormData]");

const refreshToken = async () => {
  const response = await api.request({
    endpoint: "/auth/refresh-token",
    method: "POST",
    body: {
      oldAccessToken: authManager.getAccessToken(),
      refreshToken: authManager.getRefreshToken(),
      deviceId: authManager.getDeviceId(),
    },
  });

  console.warn("Refresh token response:", response);
  authManager.setTokens(response.accessToken, response.refreshToken);
  return !!response?.accessToken;
};

const request = async (requestConfig: RequestConfig): Promise<any> => {
  const {
    endpoint,
    method = "GET",
    body,
    headers = {},
    ...customConfig
  } = requestConfig;

  const token = authManager.getAccessToken();
  const sendingForm = isFormData(body);

  const finalHeaders: Record<string, string> = {
    // Only set JSON headers when NOT sending FormData
    ...(sendingForm ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers, // allow caller to override/extend (but don't force Content-Type for FormData)
  };

  const config: RequestInit = {
    method,
    headers: finalHeaders,
    body: sendingForm ? body : body != null ? JSON.stringify(body) : undefined,
    ...customConfig,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const parsedBody = await getResponseBody(response);

    // Handle 401 with optional refresh
    if (response.status === 401) {
      if (
        requestConfig.endpoint !== "/auth/refresh-token" &&
        (await refreshToken())
      ) {
        return request(requestConfig); // retry with new tokens
      }
      authManager.handleUnauthorized();
    }

    if (!response.ok) {
      // Build a robust message from many possible server shapes
      const msg =
        (parsedBody &&
          typeof parsedBody === "object" &&
          (parsedBody.message ||
            parsedBody.error ||
            parsedBody.title ||
            parsedBody.detail)) ||
        (typeof parsedBody === "string" && parsedBody) ||
        `HTTP ${response.status} ${response.statusText || ""}`.trim();

      const err: any = new Error(msg);
      err.status = response.status;
      err.payload = parsedBody;
      // include model state / errors if present
      if (parsedBody && typeof parsedBody === "object" && parsedBody.errors) {
        err.payloadErrors = parsedBody.errors;
      }
      throw err;
    }

    return parsedBody;
  } catch (error: any) {
    // Defensive logging — never dereference deep chains
    console.log("API error:", error?.message ?? error);
    console.log(
      "Error details:",
      error?.payload ?? error?.payloadErrors ?? null
    );
    console.log("Status:", error?.status ?? null);
    throw error;
  }
};

async function getResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  // Try JSON first; fall back to raw text for HTML/plain errors
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = { request };
