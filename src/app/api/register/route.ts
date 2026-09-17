import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

const RegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
  name: z.string().trim().min(1, "Enter your name.").max(80),
});

export async function POST(req: NextRequest) {
  try {
    const body = RegisterSchema.safeParse(await req.json());
    if (!body.success) {
      return jsonError(body.error.issues[0]?.message ?? "Invalid input.");
    }

    const { email, password, name } = body.data;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return jsonError("An account with this email already exists. Try logging in.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, passwordHash },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ ok: true, user });
  } catch {
    return jsonError("Something went wrong. Please try again.", 500);
  }
}