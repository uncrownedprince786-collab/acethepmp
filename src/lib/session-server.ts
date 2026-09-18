import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const GUEST_COOKIE = "atp_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function makeCookie(value: string) {
  return `${GUEST_COOKIE}=${value}; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

async function createSession(userId: string | null) {
  return prisma.session.create({
    data: {
      token: crypto.randomUUID(),
      userId,
    },
  });
}

/**
 * Read-only context for server components. The session may be null for a
 * brand-new visitor; the /api/session endpoint creates one lazily.
 */
export async function readLearningContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_COOKIE)?.value ?? null;

  let sessionId: string | null = null;
  if (token) {
    const s = await prisma.session.findUnique({ where: { token } });
    sessionId = s?.id ?? null;
  }

  const authSession = await auth();
  const userId = authSession?.user?.id ?? null;

  if (!sessionId && userId) {
    const s = await prisma.session.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
    sessionId = s?.id ?? null;
  }

  return { sessionId, userId, token };
}

/**
 * Get-or-create the learner session, and link it to the signed-in user when
 * present. Returns the token so callers can attach the cookie to a response.
 */
export async function getOrCreateSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(GUEST_COOKIE)?.value ?? null;

  let session = token ? await prisma.session.findUnique({ where: { token } }) : null;

  const authSession = await auth();
  const userId = authSession?.user?.id ?? null;

  if (!session && userId) {
    session = await prisma.session.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  if (!session) {
    session = await createSession(userId);
    return { session, cookie: makeCookie(session.token) };
  }

  // Link the guest session to the signed-in account when appropriate so that
  // progress follows the user across devices.
  if (userId && session.userId !== userId) {
    session = await prisma.session.update({
      where: { id: session.id },
      data: { userId },
    });
  }

  return { session, cookie: token ?? null };
}

export function attachSessionCookie(response: NextResponse, cookieValue: string | null) {
  if (cookieValue) response.headers.set("Set-Cookie", cookieValue);
  return response;
}

/** Convenience wrapper: create a JSON response with the session cookie. */
export async function jsonWithSession(body: Record<string, unknown>, init?: number) {
  const { cookie } = await getOrCreateSession();
  const res = NextResponse.json(body, init ? { status: init } : undefined);
  return attachSessionCookie(res, cookie);
}