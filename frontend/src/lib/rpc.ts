export async function rpc<T>(method: string, params?: unknown): Promise<T> {
  const res = await fetch("/api/rpc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, params }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || res.statusText);
  }

  const json = (await res.json()) as unknown;
  if (isRpcError(json)) {
    throw new Error(json.error.message || "RPC call failed");
  }

  if (!isRpcSuccess(json)) {
    throw new Error("Unexpected RPC response shape");
  }

  return json.data as T;
}

function isRpcError(value: unknown): value is { error: { message?: string } } {
  return Boolean(value && typeof value === "object" && "error" in value);
}

function isRpcSuccess(value: unknown): value is { data: unknown } {
  return Boolean(value && typeof value === "object" && "data" in value);
}
