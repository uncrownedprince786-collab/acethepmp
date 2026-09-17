import { NextResponse } from "next/server";
import { resolveSession, withSessionCookie } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

/**
 * Lazily boots the learner session cookie. Called once by the client so that
 * anonymous progress can be saved before the user ever registers.
 */
export async function GET() {
  const { sessionId, cookie } = await resolveSession();
  const res = NextResponse.json({ ok: true, sessionId });
  return withSessionCookie(res, cookie);
}