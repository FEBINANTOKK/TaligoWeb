export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type JsonRecord = Record<string, unknown>;

async function parseErrorResponse(res: Response): Promise<string> {
  const fallback = `API error: ${res.status} ${res.statusText}`;

  try {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = (await res.json()) as {
        message?: string;
        error?: string;
      };
      return data.message ?? data.error ?? fallback;
    }

    const text = await res.text();
    return text || fallback;
  } catch {
    return fallback;
  }
}

async function request<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: JsonRecord,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(await parseErrorResponse(res));
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {} as T;
  }

  return res.json() as Promise<T>;
}

export async function fetchProtected<T = unknown>(
  endpoint: string,
): Promise<T> {
  return request<T>(endpoint, "GET");
}

export async function postProtected<T = unknown>(
  endpoint: string,
  body: JsonRecord,
): Promise<T> {
  return request<T>(endpoint, "POST", body);
}

export async function putProtected<T = unknown>(
  endpoint: string,
  body: JsonRecord,
): Promise<T> {
  return request<T>(endpoint, "PUT", body);
}

export async function patchProtected<T = unknown>(
  endpoint: string,
  body: JsonRecord,
): Promise<T> {
  return request<T>(endpoint, "PATCH", body);
}

export async function deleteProtected<T = unknown>(
  endpoint: string,
): Promise<T> {
  return request<T>(endpoint, "DELETE");
}
