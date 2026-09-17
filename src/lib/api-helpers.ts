import { NextResponse, type NextRequest } from "next/server";
import { getOrCreateSession, attachSessionCookie } from "@/lib/session-server";

/** Resolve the learner session for an API request, attaching a cookie when one was just created. */
export async function resolveSession() {
  const { session, cookie } = await getOrCreateSession();
  return { sessionId: session.id, cookie };
}

/** Attach the JSESSION-style cookie to any response we return from a route. */
export function withSessionCookie(res: NextResponse, cookie: string | null) {
  return attachSessionCookie(res, cookie);
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function readJson<T>(req: NextRequest): Promise<T> {
  return (await req.json()) as T;
}