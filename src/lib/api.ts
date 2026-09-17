"use client";

/**
 * Client-side API helpers. `ensureSession` bootstraps the guest session cookie
 * so anonymous progress is saved even before the user creates an account.
 */
let bootstrapped = false;

export async function ensureSession(): Promise<void> {
  if (bootstrapped) return;
  try {
    await fetch("/api/session", { method: "GET", credentials: "same-origin" });
  } catch {
    // Non-fatal — signed-in users and later requests still work.
  } finally {
    bootstrapped = true;
  }
}

export async function apiFetch<T = unknown>(
  input: string,
  init?: RequestInit
): Promise<T> {
  await ensureSession();
  const res = await fetch(input, {
    ...init,
    credentials: "same-origin",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  const data = (await res.json().catch(() => null)) as T & { error?: string } | null;
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }
  return data as T;
}